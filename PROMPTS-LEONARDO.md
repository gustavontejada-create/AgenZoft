# Prompts Leonardo AI — AgenZoft

Guía completa para generar las imágenes y videos que faltan en el sitio.
Cada bloque incluye: dónde va, dimensiones, configuración recomendada de Leonardo, prompt positivo y prompt negativo.

---

## 0. Guía de estilo (aplicar a TODOS los prompts)

Para que el sitio se vea **coherente**, todas las imágenes deben respetar:

- **Paleta principal**: violeta indigo `#6055D4`, violeta claro `#8B7FE8`, violeta profundo `#4A40B8`
- **Fondos**: muy oscuros `#08080f`, `#0e0e1a`, gradiente radial sutil hacia el violeta
- **Acentos**: blanco roto `#e2e4ee` para texto, gris `#8e90a8` para muted
- **Tono**: agencia de software seria, profesional, **NO** cartoon, **NO** neón saturado, **NO** sci-fi exagerado
- **Iluminación**: cinematográfica, suave, con un solo punto de luz violeta tenue
- **Estilo general**: minimalista corporativo · editorial tech · fotorrealismo cinematográfico

### Configuración base de Leonardo (defaults)

| Parámetro | Valor recomendado |
|---|---|
| **Modelo** | Leonardo Phoenix 1.0 (o Flux Dev para más realismo) |
| **Preset Style** | "Cinematic" o "None" |
| **Guidance Scale** | 7 |
| **Contrast** | Medium |
| **PhotoReal** | ON (para mockups e interiores) |
| **Alchemy** | ON |
| **Number of images** | 4 por prompt (para elegir) |

### Negative prompt universal (copiar en todos)

```
neon excessive, oversaturated, cartoon, anime, child illustration, low quality,
blurry, distorted, deformed, watermark, signature, text errors, jpeg artifacts,
fisheye, ultra wide angle distortion, weird hands, extra fingers, cyan blue colors,
turquoise, teal, pastel pink, lime green, dated 90s aesthetic, cheap stock photo
```

---

## 1. Hero principal (index.html)

### 1A · Video Hero — `assets/videos/hero-loop.mp4`

**Ubicación en el sitio**: fondo del hero principal de `index.html` (detrás del logo grande "AgenZoft").
**Aspecto**: 16:9 horizontal · **Resolución**: 1920×1080 · **Duración**: 5 segundos · **Loop**: sí
**Herramienta**: Leonardo Motion 2.0
**Volumen**: sin audio (será muted en autoplay)

**Prompt positivo:**

```
Cinematic slow camera dolly forward through a dark high-tech corporate office at night,
glass walls reflecting deep indigo violet light (#6055D4 hex), abstract holographic
data streams floating in the air, sharp geometric purple light trails moving slowly
from background to foreground, minimalist architectural environment, ultra clean
desks with closed laptops, no people, atmospheric haze, volumetric lighting,
deep dark background fading to almost black at the edges, only one warm indigo
violet glow source, professional software agency aesthetic, premium serious
corporate mood, photorealistic, IMAX cinematic look, 8k, ultra detailed,
shallow depth of field, anamorphic lens flare in violet tones
```

**Motion guidance (en Leonardo Motion):**
- Motion strength: **3 / 10** (movimiento muy sutil — es un loop de fondo)
- Camera: slow dolly forward
- No abrupt cuts. Movimiento debe ser perfectamente loopeable.

**Negative prompt:** (universal + extra)
```
people, faces, text, logos, brands, cyan, turquoise, neon green, daytime, sun,
office workers, cluttered, busy scene, fast motion
```

**Alternativa estática** (si no usás video): generar como imagen con el mismo prompt, exportar a `assets/images/hero_agency.png` (el sitio ya tiene fallback a esta imagen).

---

## 2. ComercioPro — Hero principal

### 2A · Mockup principal del panel — `assets/images/mockup_comerciopro.png` (reemplazo)

**Ubicación**: debajo del título "ComercioPro" en `comerciopro.html`
**Aspecto**: 16:10 horizontal · **Resolución**: 1600×1000 · **Tipo**: imagen estática
**Herramienta**: Leonardo Phoenix 1.0 + PhotoReal

**Prompt positivo:**

```
Ultra realistic mockup of a modern POS (point of sale) software interface displayed
on a sleek 27-inch dark mode monitor, deep black background #0a0a12 with subtle
indigo violet UI accents #6055D4, clean grid layout showing product catalog tiles
with thumbnails on left, large search bar at top with Spanish placeholder text,
shopping cart panel on right with item totals in Argentine pesos, professional
dashboard design with cards and KPI metrics, soft purple ambient glow behind the
screen, minimalist desk with a barcode scanner and a small succulent plant,
professional retail store environment in soft blur background, editorial product
shot, studio lighting, 8k, photorealistic, premium SaaS aesthetic, cinematic
```

**Negative prompt:** (universal + extra)
```
cluttered UI, ugly buttons, cyan accents, gaming RGB, multiple monitors, person
visible, dirty desk, paper documents, stock photo cliche, watermark
```

### 2B · Video alternativo (recomendado) — `assets/videos/comerciopro-panel.mp4`

**Ubicación**: mismo lugar que 2A (el `<img>` se puede reemplazar por `<video>`)
**Duración**: 5 segundos · **Loop**: sí · **16:10 1600×1000**
**Herramienta**: Leonardo Motion 2.0

**Prompt positivo:** (usar el de 2A + motion)

**Motion guidance:**
- Motion strength: **2 / 10**
- Camera: very slow push-in toward the monitor (3% zoom durante los 5s)
- En el monitor: que se vea sutilmente la lista de productos haciendo scroll lento

---

## 3. Feature Showcase ComercioPro (6 imágenes)

Todas son **4:3 · 1280×960** · imágenes estáticas. Usar Leonardo Phoenix + PhotoReal.

### 3A · Feature 1 — "Pantalla POS en uso" → reemplazar placeholder

**Prompt positivo:**

```
Close-up shot of a hand pressing buttons on a 21-inch touchscreen point of sale
terminal in a small Argentine retail shop, dark mode interface with deep indigo
violet accents #6055D4, product tiles visible in spanish (Coca-Cola 2.25L, Pan
Lactal, Yerba La Hoja), barcode scanner just used, ticket printing on thermal
printer in background, warm afternoon light coming from a window on the right,
shallow depth of field focused on the screen, real wooden counter, professional
photography, editorial commercial style, cinematic, 8k, ultra detailed
```

### 3B · Feature 2 — "Modo offline + sincronización"

**Prompt positivo:**

```
Studio macro photograph of a tablet displaying a software dashboard in dark mode
with a prominent indigo violet status indicator showing "Sin conexión —
sincronizando 23 ventas" in spanish, abstract floating cloud icon with purple
glow, list of pending transactions visible on screen, dramatic single light source
from above, deep black background, premium corporate aesthetic, sense of trust
and reliability, professional product shot, 8k, photorealistic, no people,
calm and serene mood
```

### 3C · Feature 3 — "Cuenta corriente + WhatsApp"

**Prompt positivo:**

```
Split composition: left side shows a laptop screen with a customer account
management dashboard in dark mode with indigo violet accents #6055D4, listing
transactions and balances in Argentine pesos with spanish labels (Saldo, Vencido,
Histórico); right side shows a smartphone with WhatsApp interface receiving a
formatted account statement message, both devices on a clean dark walnut desk,
soft top-down lighting, premium fintech editorial photography, professional,
8k, photorealistic, minimalist composition, no people, no faces
```

### 3D · Feature 4 — "Historial de precios + rentabilidad"

**Prompt positivo:**

```
Editorial product shot of a monitor showing an analytics dashboard with multiple
sparkline graphs in indigo violet (#6055D4 and #8B7FE8) trending upward, profit
margin percentages, a table of products with their price evolution over time,
clean dark mode UI design with spanish labels (Rentabilidad, Margen Bruto,
Tendencia), premium SaaS aesthetic, soft purple bokeh in background, single
desk lamp providing warm light, no people, professional commercial photography,
8k, photorealistic
```

### 3E · Feature 5 — "Stock por sucursal"

**Prompt positivo:**

```
Modern warehouse shelves stocked with neatly organized retail products in shallow
focus background, foreground sharp focus on a tablet held in hand (only hand
visible) displaying an inventory management app in dark mode with indigo violet
UI (#6055D4), showing product list with stock quantities per location (Sucursal
Centro: 12, Sucursal Norte: 5, in spanish), warm industrial lighting, deep
blacks, editorial commercial photography, ultra realistic, 8k, premium business
software aesthetic
```

### 3F · Feature 6 — "Dashboard con KPIs"

**Prompt positivo:**

```
Stunning ultra-wide shot of a curved 34-inch monitor displaying a beautiful
analytics dashboard in dark mode with indigo violet accents (#6055D4), large
KPI cards showing daily revenue, products sold, average ticket, all in spanish
with Argentine peso values, line and bar charts in violet gradient, alert bell
icon with notification badge in top right corner, deep black background, soft
ambient purple lighting from behind monitor, minimalist desk with one mechanical
keyboard, professional CEO office mood, editorial commercial photography,
photorealistic, 8k, cinematic depth
```

---

## 4. Banner Tienda Online

### 4A · Mockup mobile + desktop — `(placeholder en sección banner tienda)`

**Aspecto**: 4:5 vertical · **Resolución**: 1080×1350**
**Herramienta**: Leonardo Phoenix 1.0 + PhotoReal

**Prompt positivo:**

```
Premium e-commerce mockup composition: a 15-inch MacBook Pro showing an elegant
online store homepage in dark mode with indigo violet accents (#6055D4), product
grid with high-quality product photos, "Comprar" buttons in violet, top banner
announcement, alongside an iPhone 15 Pro displaying the same store optimized for
mobile, both devices floating on a dark indigo gradient background, soft purple
glow and shadows underneath, marble texture surface subtle, editorial commercial
photography for SaaS product launch, professional studio lighting, ultra detailed,
8k, photorealistic, premium aspirational mood, no people
```

---

## 5. Imágenes complementarias opcionales (para enriquecer el sitio)

### 5A · Foto del equipo / oficina (opcional para sección "Por qué AgenZoft")

**Aspecto**: 4:3 · 1280×960

**Prompt positivo:**

```
Editorial photograph of a modern small software agency office in Córdoba Argentina,
two designers and one developer collaborating around a large dark monitor showing
code and UI designs in violet tones, large windows with afternoon light, exposed
brick wall with one violet neon strip detail (subtle), plants, MacBooks, casual
professional attire, warm color grading with violet accents, sense of focus and
craftsmanship, candid documentary style, ultra realistic, 8k, no logos visible
```

### 5B · Foto cliente real / testimonio (opcional)

**Aspecto**: 1:1 · 1024×1024 (avatar) o 4:5 · 1080×1350 (full)

**Prompt positivo:**

```
Authentic portrait of an Argentine small business owner (50 year old man with
mustache, friendly smile, wearing a polo shirt) standing behind the counter of
his neighborhood almacén/grocery store, soft afternoon natural light from window,
shelves with products softly out of focus behind him, warm color palette,
documentary commercial photography style, premium editorial, photorealistic, 8k
```

(generar varios con descripciones distintas: dueña de boutique, dueño de pet shop, etc.)

---

## 6. FerreGestión (cuando lo encares)

Mismo enfoque. Cambiar el contexto: ferretería, herramientas, materiales de construcción, paleta sigue siendo violeta indigo de AgenZoft.

---

## 7. Cómo procesarlos después de Leonardo

1. **Descargar** en máxima resolución desde Leonardo.
2. **Optimizar** con [Squoosh](https://squoosh.app) → exportar a **WebP** con calidad 82–85.
3. **Renombrar** según el path indicado arriba.
4. **Colocar** en la carpeta correspondiente:
   - Imágenes feature → `assets/images/feature-1.webp`, `feature-2.webp`, etc.
   - Videos → `assets/videos/hero-loop.mp4`, `comerciopro-panel.mp4`
5. **Reemplazar el `<div class="media-placeholder">`** del HTML por:
   ```html
   <img src="assets/images/feature-1.webp" alt="POS en uso" loading="lazy">
   ```
   o para videos:
   ```html
   <video autoplay muted loop playsinline poster="assets/images/feature-1.webp">
     <source src="assets/videos/feature-1.mp4" type="video/mp4">
   </video>
   ```

---

## 8. Tip de ahorro

Leonardo cobra por imagen. Para no gastar tokens al pedo:
- **Generar 4 variantes por prompt** y elegir la mejor.
- **Refinar la elegida con Upscale** (no regenerar de cero).
- Para videos: empezar con motion strength bajo (1-3) y aumentar solo si el movimiento se siente plano. Motion alto consume más tokens y suele dar resultados raros.

---

## 9. Workflow recomendado (1 sesión de 2 horas)

1. **Bloque hero** (videos 1A, 2B): 20 min
2. **Feature showcase** (6 imágenes 3A-3F): 60 min
3. **Tienda online** (4A): 15 min
4. **Procesar + subir + reemplazar HTML**: 25 min

Si querés, cuando tengas las imágenes generadas las cargás y yo te las dejo enchufadas reemplazando los `media-placeholder` en una sola pasada.
