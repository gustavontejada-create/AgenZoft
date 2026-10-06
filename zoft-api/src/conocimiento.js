// Base de conocimiento de Zoft: los .md de /conocimiento + los precios vigentes.
// Los precios se leen de la web (la misma fuente que muestra la página) y, si no responde,
// de la copia local conocimiento/precios.json. Así web y Zoft nunca dicen precios distintos.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'conocimiento');
const PRECIOS_URL = process.env.ZOFT_PRECIOS_URL || '';
const CACHE_MS = 10 * 60 * 1000;

let textos = null;
let precios = { datos: null, leidoEn: 0, origen: '' };

const NOMBRE_PLAN = { basico: 'Básico', profesional: 'Profesional', enterprise: 'Enterprise' };
const NOMBRE_PROD = { comerciopro: 'ComercioPro', supertecnico: 'SuperTécnico', raices: 'Raíces' };
const pesos = (n) => '$' + Number(n).toLocaleString('es-AR');

async function cargarTextos() {
  if (textos) return textos;
  const archivos = (await readdir(DIR)).filter((f) => f.endsWith('.md')).sort();
  const partes = await Promise.all(archivos.map((f) => readFile(path.join(DIR, f), 'utf8')));
  textos = partes.join('\n\n');
  return textos;
}

async function cargarPrecios() {
  if (precios.datos && Date.now() - precios.leidoEn < CACHE_MS) return precios;
  if (PRECIOS_URL) {
    try {
      const r = await fetch(PRECIOS_URL, { signal: AbortSignal.timeout(4000) });
      if (r.ok) {
        precios = { datos: await r.json(), leidoEn: Date.now(), origen: 'web' };
        return precios;
      }
    } catch { /* se usa la copia local */ }
  }
  if (!precios.datos) {
    precios = { datos: JSON.parse(await readFile(path.join(DIR, 'precios.json'), 'utf8')), leidoEn: Date.now(), origen: 'local' };
  }
  return precios;
}

function preciosATexto(d) {
  const lineas = [`# Precios vigentes (en pesos argentinos, actualizados al ${d.actualizado})`, ''];
  for (const [id, prod] of Object.entries(d.productos)) {
    lineas.push(`## ${NOMBRE_PROD[id] || prod.nombre}`);
    for (const p of prod.planes) {
      const lim = [];
      if (p.usuarios) lim.push(`${p.usuarios} usuarios`);
      if (p.locales) lim.push(`${p.locales} local${p.locales > 1 ? 'es' : ''}`);
      if (p.sucursales) lim.push(`${p.sucursales} sucursal`);
      if (p.clientes) lim.push(`hasta ${p.clientes} clientes`);
      if (p.propiedades) lim.push(`hasta ${p.propiedades} propiedades`);
      if (p.consultas_ia_mes) lim.push(`${p.consultas_ia_mes} consultas a Zoft por mes`);
      lineas.push(`- Plan ${NOMBRE_PLAN[p.id] || p.nombre}: ${pesos(p.mensual)} por mes o ${pesos(p.anual)} por año. ${lim.join(', ')}.`);
    }
    lineas.push('');
  }
  lineas.push(`Todos los planes tienen ${d.prueba_gratis_dias} días de prueba gratis sin tarjeta.`);
  return lineas.join('\n');
}

export async function baseDeConocimiento() {
  const [t, p] = await Promise.all([cargarTextos(), cargarPrecios()]);
  return { texto: t + '\n\n' + preciosATexto(p.datos), origenPrecios: p.origen };
}
