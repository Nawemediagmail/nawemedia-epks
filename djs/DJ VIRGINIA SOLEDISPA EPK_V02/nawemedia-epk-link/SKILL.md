---
name: nawemedia-epk-link
description: >
  Construye el EPK Link completo de un DJ o artista electrónico: una página web
  standalone (HTML único) con hero, bio, shows, galería, música embebida y panel
  de administración protegido por contraseña, lista para desplegar en GitHub +
  Vercel/Netlify.

  SIEMPRE usar esta skill cuando el usuario mencione:
  "EPK para DJ", "presskit digital", "crear sitio para artista", "EPK link",
  "link de prensa", "press kit web", "construir EPK", "hacer el presskit de",
  "armar el link del artista", "página web para DJ", "herramienta de promoción
  para artista", o cualquier variante de crear una presencia web de press kit
  para un músico o DJ. También activar si el usuario sube fotos + bio + logos
  de un artista y pide "hacer algo" con eso.
---

# NAWEMEDIA — EPK Link

Construye la herramienta de promoción digital definitiva para DJs y artistas
electrónicos: un único link que reemplaza el presskit tradicional, con panel de
administración para que el artista lo actualice sin necesitar un diseñador.

---

## 1. ANTES DE EMPEZAR — Reunir assets

Antes de escribir una sola línea de código, reúne todo lo que existe:

```
assets necesarios
├── Fotos           → leer visualmente para evaluar cuál es la mejor de hero
├── Logos           → identificar versión clara (para nav en dark bg) y de color
├── BIO.txt         → bio completa del artista
└── Info del usuario → géneros, redes, email de booking, sets de SoundCloud
```

**Lee las imágenes con la herramienta Read** antes de construir. Necesitas:
- Identificar la foto más impactante para el hero (fondo de pantalla completa)
- Determinar la paleta de color del artista mirando su logo
- Contar cuántas fotos hay para la galería

Si faltan datos críticos (email, géneros, redes), pregunta solo lo que falta.
No pidas lo que ya puedes inferir de los archivos.

---

## 2. ESTRUCTURA DE ARCHIVOS DEL PROYECTO

Crea esta estructura limpia antes de construir el HTML. Usa `bash` para copiar
con nombres normalizados (sin espacios ni caracteres especiales):

```
[carpeta-artista]/
├── index.html              ← el EPK completo
├── .gitignore
└── assets/
    ├── logo-black.png      ← logo versión oscura/simple (para invertir en nav)
    ├── logo-color.png      ← logo versión de color/principal
    └── photos/
        ├── hero.jpeg       ← foto principal (landscape, idealmente con el artista)
        ├── press-1.jpeg    ← fotos de prensa
        ├── press-2.jpeg
        └── editorial-1.jpeg, editorial-2.jpeg ...
```

Guarda `index.html` directamente en la carpeta del artista (no en subcarpeta),
porque el HTML referencia imágenes con rutas relativas (`assets/photos/hero.jpeg`).

---

## 3. IDENTIDAD VISUAL — Extraer color del artista

El EPK debe usar los colores reales del artista, no un template genérico. Mira
el logo y define:

```css
--accent: [color principal del artista, ej: #E8177A para rosa]
--accent2: rgba([mismo color], 0.12)   /* fondo tintado muy suave */
--borderp: rgba([mismo color], 0.18)   /* borde tintado */
```

Si el artista no tiene un color de marca claro, usa blanco puro (`#ffffff`) como
accent — funciona para cualquier género.

**Paleta base siempre oscura:**
```css
--bg: #070707      /* fondo principal */
--bg2: #0e0e0e     /* fondo tarjetas */
--bg3: #161616     /* fondo elementos anidados */
--text: #ffffff
--text2: #888888
--text3: #444444
```

---

## 4. SECCIONES DEL EPK

El HTML tiene estas secciones en este orden:

| # | Sección | Audiencia | Contenido |
|---|---------|-----------|-----------|
| 1 | **Hero** | Todos | Foto full-screen, nombre grande, géneros, botón booking |
| 2 | **Bio** | Prensa / Booking | Párrafos de bio, stats (debut/shows/países), redes sociales |
| 3 | **Shows** | Promotores / Fans | Fechas futuras con venue, ciudad, estado, link tickets |
| 4 | **Galería** | Diseñadores / Medios | Grid 4 columnas, filtros por categoría, lightbox |
| 5 | **Música** | Promotores / Fans | Embeds de SoundCloud (sets y releases) |
| 6 | **Press Kit** | Medios / Productoras | Links de descarga: fotos HD, logos, bio, rider técnico |

---

## 5. INTEGRACIÓN SOUNDCLOUD

Los usuarios comparten links cortos (`https://on.soundcloud.com/XXXXX`).
Resuelve cada uno con `web_fetch` para obtener el track ID:

```
Hacer fetch del short URL
Buscar en el HTML resultante: meta-al:ios:url → soundcloud://sounds:TRACK_ID
O buscar en: meta-twitter:player → api.soundcloud.com/tracks/TRACK_ID
```

El embed URL final:
```
https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F{TRACK_ID}&color=%23{COLOR_HEX_SIN_HASH}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false
```

El parámetro `color` debe ser el accent del artista sin `#` (ej: `E8177A`).
Altura del iframe: `166px` (player compacto).

---

## 6. ARQUITECTURA DEL PANEL ADMIN

El admin es la característica diferenciadora del EPK Link.

**Almacenamiento de datos — un script tag JSON:**
```html
<script id="epk-data" type="application/json">
{
  "artist": { "name": "...", "genre": [...], "bio": [...], "photo": "assets/photos/hero.jpeg",
    "stats": { "debut": "2021", "shows": "150+", "countries": "3" },
    "social": { "instagram": "...", "soundcloud": "...", "spotify": "", "facebook": "" },
    "contact": "email@dominio.com" },
  "shows": [],
  "gallery": [
    { "id": 1, "url": "assets/photos/hero.jpeg", "caption": "...", "category": "prensa", "featured": true }
  ],
  "music": [
    { "id": 1, "title": "...", "type": "set", "embedUrl": "https://w.soundcloud.com/player/?..." }
  ],
  "presskit": {
    "description": "...",
    "items": [
      { "id": 1, "name": "Fotos de Prensa HD", "size": "—", "format": "JPG", "url": "#", "icon": "📷" }
    ]
  },
  "admin": { "password": "[artista][año]" }
}
</script>
```

**Export HTML — cómo funciona:**
```javascript
function exportHTML() {
  document.getElementById('epk-data').textContent = JSON.stringify(EPK, null, 2);
  const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'index.html';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
```

**Las 6 pestañas del admin:**
1. **Artista** — géneros, bio (4 párrafos), foto hero, email, stats, redes
2. **Shows** — agregar/eliminar fechas (date, venue, city, country, type, status, ticketUrl)
3. **Galería** — agregar/eliminar fotos (url, caption, category, featured)
4. **Música** — agregar/eliminar embeds de SoundCloud
5. **Press Kit** — descripción + lista de archivos con sus URLs de descarga
6. **Config** — cambiar contraseña + guía de 5 pasos para publicar

**Contraseña default:** `[nombre artista lowercase][año actual]` (ej: `virginia2024`)

**Acceso:** botón ⚙ fijo en esquina inferior derecha (`position: fixed; bottom: 28px; right: 28px`)

---

## 7. FUNCIONALIDADES DE UX

**Galería:**
- Grid 4 columnas, `aspect-ratio: 3/4` (formato retrato — ideal para fotos de DJs)
- Primera foto puede ser `featured: true` = ocupa 2×2 en el grid
- Filtros por categoría: Prensa / Lifestyle / Shows
- Lightbox con navegación ←→ y Escape
- `loading="lazy"` en todas las imágenes

**Shows:**
- Filtrar automáticamente fechas pasadas: `s.date >= new Date().toISOString().split('T')[0]`
- Si no hay fechas: mostrar mensaje placeholder amigable
- Status posibles: `upcoming` / `sold-out` / `cancelled`

**Nav:**
- Sticky con `backdrop-filter: blur(20px)` y borde que aparece al scrollear
- Logo: `logo-black.png` con `filter: invert(1)` → aparece blanco en dark bg
- Mobile: hamburger + menú full-screen overlay

**Animaciones:**
- `IntersectionObserver` para fade-in (`opacity: 0` → `1`, `translateY(16px)` → `0`)
- Hero bg con Ken Burns suave: `transform: scale(1.04)` → `scale(1)` en 10 segundos

---

## 8. LOGO EN EL NAV

```css
.nav-logo img {
  height: 22px;
  filter: invert(1);  /* negro → blanco sobre nav oscuro */
  opacity: 0.9;
}
```

Si el logo tiene fondo blanco opaco y el fondo negro del invert queda visible,
no es problema: se mezcla con el nav oscuro. Si el resultado es inaceptable,
usar solo texto CSS con el nombre del artista.

---

## 9. .GITIGNORE Y DEPLOYMENT

```gitignore
# Sistema
.DS_Store
Thumbs.db
desktop.ini

# Archivos originales (ya copiados en assets/)
FOTOS/
BIO.txt
*.psd
*.ai
```

**Instrucciones de deploy para el artista:**
1. `git init` → `git add .` → `git commit -m "EPK inicial"`
2. Crear repo en GitHub y hacer push
3. En Netlify/Vercel: conectar repo → deploy automático
4. Para actualizar: Admin → Exportar HTML → reemplazar `index.html` en GitHub → auto-deploy

---

## 10. FOOTER — BRANDING NAWEMEDIA OBLIGATORIO

```html
<a class="footer-by" href="https://nawemedia.com" target="_blank" rel="noopener">
  EPK by <strong>NAWEMEDIA</strong>
</a>
```

Esto siempre va en el footer. No es negociable.

---

## 11. CHECKLIST ANTES DE ENTREGAR

- [ ] `index.html` abre en Chrome sin errores de consola
- [ ] Foto hero carga (la ruta `assets/photos/hero.jpeg` existe)
- [ ] Los SoundCloud players se cargan
- [ ] Galería muestra todas las fotos con filtros funcionando
- [ ] Lightbox abre y navega con teclado
- [ ] Admin panel abre con la contraseña
- [ ] "Guardar Cambios" actualiza el DOM en tiempo real
- [ ] "Exportar HTML" descarga el archivo
- [ ] El HTML exportado funciona standalone
- [ ] Footer muestra "EPK by NAWEMEDIA"
- [ ] `.gitignore` existe en la raíz

---

## REFERENCIA DE CÓDIGO

Ver `references/html-patterns.md` para snippets reutilizables:
- CSS completo con todas las variables y componentes
- Render functions (hero, bio, shows, gallery, music, presskit)
- Admin panel HTML + JS completo
- Lightbox implementation
- Export HTML function
- Toast notification
