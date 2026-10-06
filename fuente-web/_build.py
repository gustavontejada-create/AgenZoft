"""Arma las páginas del sitio (en la raíz del repo) a partir de _src/*.html (contenido) + encabezado y pie comunes.
Uso: python _build.py   (desde cualquier carpeta; escribe las páginas en la raíz del repo)
Cada _src/<pagina>.html empieza con un comentario con title, desc y clase.
Los precios salen de data/precios.json (lo leen la web y Zoft)."""
import re, pathlib

FUENTE = pathlib.Path(__file__).parent
RAIZ = FUENTE.parent   # las páginas generadas van en la raíz del repo
SITIO = "https://agenzoft.com"
sprite = (RAIZ / "assets/icons.svg").read_text(encoding="utf-8")
ICONOS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + sprite[sprite.index("<defs>"):sprite.rindex("</svg>")] + "</svg>"
V = "5"  # subir para saltear la caché de Cloudflare cuando cambien css/js

NAV = [("a-medida.html", "A medida"), ("zoft.html", "Zoft"), ("index.html#contacto", "Contacto")]
SISTEMAS = [("comerciopro.html", "#00C2FF", "ComercioPro", "Para comercios"),
            ("supertecnico.html", "#6A5CFF", "SuperTécnico", "Para talleres de servicio técnico"),
            ("raices.html", "#C99A44", "Raíces", "Para inmobiliarias")]

def head(title, desc, pagina):
    url = SITIO + ("/" if pagina == "index.html" else "/" + pagina)
    noindex = '<meta name="robots" content="noindex">' + chr(10) if pagina == "404.html" else ""
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{noindex}<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0B0F1A">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AgenZoft">
<meta property="og:locale" content="es_AR">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITIO}/assets/brand/og-agenzoft.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="assets/brand/favicon.svg?v=3">
<link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32.png?v=3">
<link rel="shortcut icon" href="favicon.ico?v=3">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/web.css?v={V}">
<link rel="stylesheet" href="floating-actions.css?v=5">
</head>"""

def header(pagina):
    cur = lambda h: ' aria-current="page"' if h == pagina else ''
    sis = "".join(f'<a href="{h}"{cur(h)}><span class="dot" style="background:{c}"></span><span><b>{n}</b><small>{d}</small></span></a>' for h, c, n, d in SISTEMAS)
    nav = "".join(f'<a href="{h}"{cur(h)}>{t}</a>' for h, t in NAV)
    return f"""<header class="top">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="AgenZoft, inicio"><img src="assets/brand/agenzoft-horizontal-oscuro.svg" alt="AgenZoft"></a>
    <button class="burger" aria-label="Abrir menú" aria-expanded="false"><svg class="ico"><use href="#i-menu"/></svg></button>
    <nav class="nav" aria-label="Principal">
      <div class="nav-drop">
        <button aria-expanded="false">Sistemas <svg class="ico"><use href="#i-down"/></svg></button>
        <div class="menu">{sis}</div>
      </div>
      {nav}
      <a class="btn btn-p btn-sm" data-wa="Hola, quiero hacer una consulta sobre AgenZoft.">Hablemos</a>
    </nav>
  </div>
</header>"""

PIE = f"""<footer class="pie-sitio">
  <div class="wrap">
    <div class="cols">
      <div><img src="assets/brand/agenzoft-horizontal-lema-oscuro.svg" alt="AgenZoft — Agencia + Software + Agente IA"><p>Sistemas listos para tu rubro y desarrollo de software a medida.</p></div>
      <div><h4>Sistemas</h4><ul><li><a href="comerciopro.html">ComercioPro</a></li><li><a href="supertecnico.html">SuperTécnico</a></li><li><a href="raices.html">Raíces</a></li></ul></div>
      <div><h4>AgenZoft</h4><ul><li><a href="a-medida.html">Desarrollo a medida</a></li><li><a href="zoft.html">Zoft</a></li><li><a href="index.html#contacto">Contacto</a></li></ul></div>
      <div><h4>Contacto</h4><ul><li><a data-wa="Hola, quiero hacer una consulta sobre AgenZoft.">WhatsApp +54 9 261 515 4308</a></li><li><a href="mailto:hola@agenzoft.com">hola@agenzoft.com</a></li><li><a href="https://instagram.com/agenzoft" target="_blank" rel="noopener">Instagram @agenzoft</a></li><li>Soporte: lunes a viernes de 9 a 18 h</li></ul></div>
    </div>
    <div class="legal"><span>© <span data-anio>2026</span> AgenZoft · Río Cuarto, Córdoba, Argentina</span><span>Agencia + Software + Agente IA</span></div>
  </div>
</footer>

<script src="js/web.js?v={V}"></script>
<script>window.ZOFT_API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:8787/chat' : 'https://zoft.agenzoft.com/chat';</script>
<script src="floating-actions.js?v=5"></script>
</body>
</html>
"""

for src in sorted((FUENTE / "_src").glob("*.html")):
    txt = src.read_text(encoding="utf-8")
    m = re.match(r"<!--(.*?)-->\s*", txt, re.S)
    meta = dict(l.split(":", 1) for l in m.group(1).strip().splitlines())
    meta = {k.strip(): v.strip() for k, v in meta.items()}
    cuerpo = txt[m.end():].replace("assets/icons.svg#", "#").replace("../assets/", "assets/")
    pagina = src.name
    html = (head(meta["title"], meta["desc"], pagina) + f'\n<body class="{meta.get("clase", "")}">\n' + ICONOS + "\n"
            + header(pagina) + "\n\n<main>\n" + cuerpo + "</main>\n\n" + PIE)
    (RAIZ / pagina).write_text(html, encoding="utf-8")
    print("armada", pagina)

# robots.txt y sitemap.xml
NL = chr(10)
paginas = [p.name for p in sorted((FUENTE / "_src").glob("*.html")) if p.name != "404.html"]
robots = NL.join(["User-agent: *", "Allow: /", "Disallow: /docs/", "Disallow: /notas/", "Sitemap: " + SITIO + "/sitemap.xml"]) + NL
(RAIZ / "robots.txt").write_text(robots, encoding="utf-8")
urls = "".join("  <url><loc>" + SITIO + ("/" if p == "index.html" else "/" + p) + "</loc></url>" + NL for p in paginas)
sitemap = '<?xml version="1.0" encoding="UTF-8"?>' + NL + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + NL + urls + "</urlset>" + NL
(RAIZ / "sitemap.xml").write_text(sitemap, encoding="utf-8")
print("robots.txt y sitemap.xml")
