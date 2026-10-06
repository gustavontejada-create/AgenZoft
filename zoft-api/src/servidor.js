// Zoft API — agente de IA de la web de AgenZoft.
// POST /chat           { mensajes: [{ rol: 'usuario' | 'zoft', texto }] } -> { respuesta, derivar, sinDato }
// GET  /salud          estado del servicio
// GET  /sin-respuesta  preguntas que Zoft no supo responder (requiere ?token=ZOFT_ADMIN_TOKEN)
import http from 'node:http';
import { appendFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { baseDeConocimiento } from './conocimiento.js';
import { instrucciones } from './instrucciones.js';

const PUERTO = Number(process.env.PORT || 8787);
const ORIGENES = (process.env.ZOFT_ORIGENES || 'https://agenzoft.com,https://www.agenzoft.com')
  .split(',').map((s) => s.trim()).filter(Boolean);
const MAX_TURNOS = 12;          // mensajes de historial que se mandan al modelo
const MAX_CARACTERES = 600;     // por mensaje del visitante
const POR_MINUTO = Number(process.env.ZOFT_POR_MINUTO || 8);
const POR_DIA = Number(process.env.ZOFT_POR_DIA || 60);
const TOPE_DIARIO = Number(process.env.ZOFT_TOPE_DIARIO || 1500); // protege el cupo del plan gratuito
const REGISTRO_DIR = process.env.ZOFT_REGISTRO_DIR || './registro';
const ADMIN_TOKEN = process.env.ZOFT_ADMIN_TOKEN || '';

const proveedor = await import(`./proveedores/${process.env.ZOFT_PROVEEDOR || 'gemini'}.js`);

// ── límites en memoria (se reinician al reiniciar el servicio) ──
const porIp = new Map();
let dia = new Date().toDateString();
let totalHoy = 0;

function ipDe(req) {
  return (req.headers['cf-connecting-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress || '').trim();
}

function superaLimite(ip) {
  const hoy = new Date().toDateString();
  if (hoy !== dia) { dia = hoy; totalHoy = 0; porIp.clear(); }
  if (totalHoy >= TOPE_DIARIO) return 'tope';
  const ahora = Date.now();
  const r = porIp.get(ip) || { minuto: [], dia: 0 };
  r.minuto = r.minuto.filter((t) => ahora - t < 60_000);
  if (r.minuto.length >= POR_MINUTO || r.dia >= POR_DIA) { porIp.set(ip, r); return 'ip'; }
  r.minuto.push(ahora); r.dia += 1; totalHoy += 1;
  porIp.set(ip, r);
  return null;
}

function cors(req, res) {
  const o = req.headers.origin;
  if (o && ORIGENES.includes(o)) {
    res.setHeader('Access-Control-Allow-Origin', o);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  return !o || ORIGENES.includes(o);
}

function json(res, codigo, cuerpo) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(cuerpo));
}

function leerCuerpo(req) {
  return new Promise((ok, mal) => {
    let datos = '';
    req.on('data', (c) => { datos += c; if (datos.length > 16_000) { mal(new Error('grande')); req.destroy(); } });
    req.on('end', () => ok(datos));
    req.on('error', mal);
  });
}

function validar(cuerpo) {
  if (!cuerpo || !Array.isArray(cuerpo.mensajes) || !cuerpo.mensajes.length) return null;
  const mensajes = cuerpo.mensajes.slice(-MAX_TURNOS).map((m) => ({
    rol: m && m.rol === 'zoft' ? 'zoft' : 'usuario',
    texto: String((m && m.texto) || '').slice(0, m && m.rol === 'zoft' ? 2000 : MAX_CARACTERES).trim(),
  })).filter((m) => m.texto);
  while (mensajes.length && mensajes[0].rol === 'zoft') mensajes.shift(); // el modelo espera que empiece el usuario
  if (!mensajes.length || mensajes[mensajes.length - 1].rol !== 'usuario') return null;
  return mensajes;
}

async function anotarSinRespuesta(pregunta) {
  try {
    await mkdir(REGISTRO_DIR, { recursive: true });
    await appendFile(path.join(REGISTRO_DIR, 'sin-respuesta.jsonl'),
      JSON.stringify({ fecha: new Date().toISOString(), pregunta: pregunta.slice(0, 300) }) + '\n');
  } catch (e) { console.error('[zoft] no se pudo anotar la pregunta sin respuesta:', e.message); }
}

async function chat(req, res) {
  const ip = ipDe(req);
  const limite = superaLimite(ip);
  if (limite) return json(res, 429, { error: limite === 'tope' ? 'tope_diario' : 'demasiadas_consultas' });

  let cuerpo;
  try { cuerpo = JSON.parse(await leerCuerpo(req)); } catch { return json(res, 400, { error: 'pedido_invalido' }); }
  const mensajes = validar(cuerpo);
  if (!mensajes) return json(res, 400, { error: 'pedido_invalido' });

  try {
    const { texto: base } = await baseDeConocimiento();
    const t0 = Date.now();
    const { texto, uso } = await Promise.race([
      proveedor.generar({ sistema: instrucciones(base), mensajes }),
      new Promise((_, mal) => setTimeout(() => mal(new Error('tiempo_agotado')), 30_000)),
    ]);
    const derivar = /\[DERIVAR\]/.test(texto);
    const sinDato = /\[SIN_DATO\]/.test(texto);
    const respuesta = texto.replace(/\s*\[(DERIVAR|SIN_DATO)\]\s*/g, '\n').trim();
    if (!respuesta) throw new Error('respuesta_vacia');
    if (sinDato) anotarSinRespuesta(mensajes[mensajes.length - 1].texto);
    console.log(`[zoft] ok ${Date.now() - t0}ms tokens=${uso?.totalTokenCount ?? '?'} derivar=${derivar} sinDato=${sinDato}`);
    return json(res, 200, { respuesta, derivar: derivar || sinDato, sinDato });
  } catch (e) {
    console.error('[zoft] error del proveedor:', e.status || '', String(e.message).slice(0, 200));
    return json(res, 503, { error: 'no_disponible' });
  }
}

const servidor = http.createServer(async (req, res) => {
  const permitido = cors(req, res);
  const url = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') { res.writeHead(permitido ? 204 : 403); return res.end(); }
  if (!permitido) return json(res, 403, { error: 'origen_no_permitido' });

  if (req.method === 'GET' && url.pathname === '/salud') {
    const { origenPrecios } = await baseDeConocimiento().catch(() => ({ origenPrecios: 'error' }));
    return json(res, 200, { ok: true, proveedor: proveedor.nombre, precios: origenPrecios, consultasHoy: totalHoy });
  }
  if (req.method === 'GET' && url.pathname === '/sin-respuesta') {
    if (!ADMIN_TOKEN || url.searchParams.get('token') !== ADMIN_TOKEN) return json(res, 401, { error: 'no_autorizado' });
    const txt = await readFile(path.join(REGISTRO_DIR, 'sin-respuesta.jsonl'), 'utf8').catch(() => '');
    return json(res, 200, { preguntas: txt.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) });
  }
  if (req.method === 'POST' && url.pathname === '/chat') return chat(req, res);
  return json(res, 404, { error: 'no_encontrado' });
});

servidor.listen(PUERTO, () => console.log(`[zoft] escuchando en :${PUERTO} con ${proveedor.nombre}; orígenes: ${ORIGENES.join(', ')}`));
