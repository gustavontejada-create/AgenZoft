# zoft-api — Zoft, el agente de IA de la web de AgenZoft

Servicio chico y aparte (no está dentro de NexoAdmin, DEC-138) que responde las preguntas del chat de
la web sobre los sistemas de AgenZoft, sus planes y precios, la prueba gratis y el desarrollo a medida.

- **Base de conocimiento cerrada:** `conocimiento/*.md` + precios vigentes. Zoft solo afirma lo que
  está ahí. Para que sepa algo nuevo, se edita un `.md` y se vuelve a desplegar.
- **Precios:** se leen de `ZOFT_PRECIOS_URL` (el mismo `precios.json` que muestra la web) con caché de
  10 minutos; si no responde, usa la copia `conocimiento/precios.json`.
- **Proveedor:** Gemini (`src/proveedores/gemini.js`), modelo por variable `ZOFT_MODELO`. Para pasar a
  otro proveedor se agrega `src/proveedores/<nombre>.js` con la misma función `generar()` y se cambia
  `ZOFT_PROVEEDOR`.
- **Privacidad:** no guarda conversaciones. Solo anota, sin datos de quién pregunta, las preguntas que
  no supo responder (`registro/sin-respuesta.jsonl`), para ampliar la base. En el plan gratuito de
  Gemini, Google puede usar lo enviado para mejorar sus productos: el chat avisa que no se compartan
  datos personales.

## Endpoints

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/chat` | `{ "mensajes": [{ "rol": "usuario" \| "zoft", "texto": "..." }] }` → `{ respuesta, derivar, sinDato }` |
| GET | `/salud` | Estado, proveedor y de dónde salen los precios |
| GET | `/sin-respuesta?token=…` | Preguntas que Zoft no supo responder |

`derivar: true` → la web muestra el botón "Seguir por WhatsApp con el equipo".

## Correr en local

```bash
cd zoft-api
npm install
# PowerShell: $env:GEMINI_API_KEY="..."; $env:ZOFT_ORIGENES="http://localhost:8000,http://127.0.0.1:8000"
npm start
npm run probar          # 11 preguntas de prueba, incluidas las difíciles
```
La web v2 en `localhost` ya apunta a `http://localhost:8787/chat`.

## Desplegar en Coolify

1. Nuevo recurso → **Application** desde el repo `AgenZoft`, rama `main`, **Base Directory:** `/zoft-api`,
   build con el `Dockerfile` de esta carpeta. Puerto **8787**.
2. Dominio: `https://zoft.agenzoft.com` (crear el registro DNS en Cloudflare apuntando al VPS).
3. Variables: las de `.env.example`. `GEMINI_API_KEY` es la misma que usa NexoAdmin. Generar un
   `ZOFT_ADMIN_TOKEN` al azar.
4. Volumen persistente montado en `/app/registro`.
5. Probar: `https://zoft.agenzoft.com/salud`.
6. La web v2 en producción ya apunta a `https://zoft.agenzoft.com/chat`.
