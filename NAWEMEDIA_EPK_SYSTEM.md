# NAWEMEDIA DJ EPK System — Documento de referencia completo

> **Uso**: Carga este documento como contexto en Perplexity (o cualquier AI) para crear, modificar y mantener EPKs de DJs. Contiene toda la arquitectura, decisiones técnicas y procesos del sistema construido.

---

## 1. QUÉ ES ESTE SISTEMA

**DJ EPK** = Electronic Press Kit. Una página web de una sola URL que sirve como presentación profesional de un DJ para promotores, medios y bookers.

**Stack técnico (sin frameworks, sin build step):**
- `index.html` — toda la app (HTML + CSS + JS en un solo archivo)
- **Supabase** — base de datos PostgreSQL + Storage para fotos
- **GitHub** — repositorio del código
- **Vercel** — hosting y deploy automático desde GitHub
- **Cloudflare** — DNS del dominio personalizado

**Repo template base:** `github.com/Nawemediagmail/dj-epk-template`
**EPK de referencia en producción:** `https://ambarlombardi.com`

---

## 2. INFRAESTRUCTURA NAWEMEDIA

### Cuentas y IDs fijos (no cambian entre EPKs)

| Servicio | ID / Referencia |
|---|---|
| Vercel team | `team_AJK3ksf0robM6Pr8nJ3tSIrh` |
| Supabase org | `agocbdvenolaqubwrtvf` |
| Cloudflare account | `240ee7fd42d8dffd0109eaa20047fb40` |
| GitHub user | `nawemediagmail` |
| Template repo | `nawemediagmail/dj-epk-template` |

### Tokens necesarios para setup nuevo EPK

| Token | Dónde obtenerlo | Para qué |
|---|---|---|
| Vercel API token | vercel.com → Settings → Tokens | Crear proyecto + dominio via API |
| GitHub PAT (scope: repo) | github.com → Settings → Developer → PAT classic | Push al nuevo repo |
| Cloudflare API token (Zone:DNS:Edit) | dash.cloudflare.com → Mi perfil → API Tokens | Configurar DNS (**importante**: sin restricción de IP) |

---

## 3. ARQUITECTURA DEL `index.html`

El archivo tiene ~1200 líneas y contiene todo:

```
<head>
  Google Fonts (Anton, Oswald, Inter, JetBrains Mono)
  <style> ← CSS completo (~300 líneas)
    :root { tokens de color, fuentes, espaciado }
    Estilos de componentes
  </style>
</head>
<body>
  #loader          ← pantalla de carga animada
  <nav>            ← navegación fija con links + botón admin ⚙️
  #admOv           ← panel admin (overlay, oculto por defecto)
  <main id="main"> ← renderizado por JS (vacío en HTML)
  #toast           ← notificación temporal

  <script id="epk-data" type="application/json">
    { ...EPK object completo... }  ← datos embebidos para render instantáneo
  </script>

  <script>         ← toda la lógica JS (~750 líneas)
    DataLayer (DL)
    Estado global EPK
    Funciones render
    Lógica admin panel
    Init: renderAll() → carga Supabase async → sync
  </script>
</body>
```

### Flujo de datos en cada carga de página

```
1. Render inmediato desde <script id="epk-data"> embebido
2. Si hay localStorage → sobreescribe con última versión guardada
3. renderAll() → página visible en <100ms
4. Loader desaparece a los 1.6s (setTimeout)
5. Supabase JS carga en background (async, no bloquea)
6. Cuando Supabase carga → DL.sync() compara timestamps
7. Si Supabase tiene datos más nuevos → re-render silencioso
```

**⚠️ Regla crítica**: Supabase DEBE cargarse de forma asíncrona (dynamic script injection). Si se carga con `<script src="...">` síncrono, bloquea toda la ejecución JS y la página se queda congelada en el loader. El fix está implementado en el template.

---

## 4. ESTADO GLOBAL EPK — SCHEMA COMPLETO

```javascript
EPK = {
  artist: {
    name: "string",           // Nombre display: "Ambar Lombardi"
    tagline: "string",        // Frase corta: "La Diva del Tribal"
    location: "string",       // "Perú · Venezuela"
    contact: "string",        // Email de booking
    whatsapp: "string",       // "+51913196019" (con código país)
    heroPhoto: "string",      // URL foto hero (Supabase Storage o externa)
    bioPhoto: "string",       // URL foto bio
    genres: ["string"],       // ["Tribal", "House", "Circuit"]
    stats: {
      debut: "string",        // "2025"
      shows: "string",        // "50+"
      countries: "string"     // "3"
    }
  },

  bio: {
    es: { lede: "string", body: "string" },  // lede = 1 frase. body = párrafos con \n\n
    en: { lede: "string", body: "string" },
    pt: { lede: "string", body: "string" }
  },

  shows: [{
    id: number,
    date: "YYYY-MM-DD",
    venue: "string",
    city: "string",
    country: "string",
    type: "string",           // "Club Show", "Festival", "Private", etc.
    status: "string",         // "upcoming" | "past" | "cancelled"
    ticketUrl: "string"
  }],

  gallery: [{
    id: number,
    url: "string",            // URL Supabase Storage o externa
    caption: "string",
    category: "string",       // "lifestyle" | "prensa" | "shows"
    span: "string"            // "feat" | "tall" | "wide" | ""
    // feat = 2 cols + 2 rows (foto grande destacada)
    // tall = 1 col + 2 rows (foto alta)
    // wide = 2 cols + 1 row (foto ancha)
    // ""   = 1x1 normal
  }],

  music: [{
    id: number,
    title: "string",
    type: "string",           // "set" | "track"
    embedUrl: "string"        // URL completa del SoundCloud widget embed
  }],

  presskit: {
    description: "string",
    items: [{
      id: number,
      name: "string",         // "Fotos HD"
      size: "string",         // "Drive", "12MB", etc.
      format: "string",       // "JPG", "PDF", "ZIP"
      url: "string",          // Google Drive link u otro
      icon: "string"          // emoji: "📷", "📰", "🎚️"
    }]
  },

  social: {
    instagram: "string",      // URL completa o ""
    soundcloud: "string",
    youtube: "string",
    facebook: "string",
    spotify: "string",
    tiktok: "string"
  },

  admin: {
    password: "string"        // Contraseña del panel admin (visible en código, es intencional)
  }
}
```

---

## 5. DATALAYER — CÓMO FUNCIONA LA PERSISTENCIA

```javascript
// Objeto DL — las 3 operaciones
DL.load()    // Lee localStorage → EPK object o null
DL.save(d)   // localStorage + timestamp + upsert a Supabase (fire-and-forget)
DL.sync()    // Fetch Supabase → aplica SOLO si updated_at remoto > timestamp local
```

**localStorage keys usadas:**
- `epk_{slug}_v2` → datos EPK serializados
- `epk_{slug}_ts` → timestamp ISO del último save
- `epk_{slug}_auth` → `"1"` si admin está autenticado

**Regla de timestamps (crítica para que admin saves persistan):**
- `DL.save()` escribe timestamp local + mismo timestamp en Supabase
- `DL.sync()` solo sobreescribe si `supabase.updated_at > localStorage_ts`
- Sin esto, Supabase sobreescribe los cambios del admin en cada refresh

---

## 6. CSS TOKENS — CÓMO REBRANDEAR

Todos los colores y fuentes están en `:root` al principio del `<style>`:

```css
:root {
  /* COLORES — cambiar estos para cada DJ */
  --pu: #c026d3;          /* Color primario (purple para Ambar) */
  --pur: 192,38,211;      /* Mismo color como R,G,B (para rgba()) */
  --pu2: #7c3aed;         /* Color hover/secundario */
  --bg: #07040e;          /* Fondo principal (casi negro) */
  --bg2: #0c0817;         /* Fondo secciones alternas */
  --bg3: #13102a;         /* Fondo más claro */
  --text: #f0e8ff;        /* Texto principal */
  --muted: rgba(240,232,255,.58);   /* Texto secundario */
  --faint: rgba(240,232,255,.22);   /* Texto terciario */

  /* TIPOGRAFÍA — Google Fonts */
  --d: 'Anton', Impact, sans-serif;        /* Display (títulos grandes) */
  --h: 'Oswald', sans-serif;               /* Headings */
  --s: 'Inter', system-ui, sans-serif;     /* Body text */
  --m: 'JetBrains Mono', monospace;        /* Labels, tags, UI */

  /* LAYOUT */
  --max: 1320px;           /* Ancho máximo del contenedor */
  --gap: clamp(1.25rem, 4vw, 3rem);   /* Padding horizontal responsivo */
  --r: 16px; --r2: 22px; --r3: 32px; /* Border radius */
}
```

**Para cambiar el color primario en un nuevo EPK:**
1. Reemplazar `--pu:#c026d3` con el nuevo color hex
2. Reemplazar `--pur:192,38,211` con los valores RGB del nuevo color
3. Ajustar `--pu2` para el color hover (más oscuro o diferente tono)

---

## 7. ADMIN PANEL

- **Acceso:** Ícono ⚙️ en la navbar
- **Contraseña:** Almacenada en `EPK.admin.password` (visible en código — es intencional, modelo self-hosted)
- **Tabs disponibles:** artista · bio · shows · galería · música · presskit · config
- **Guardar:** Botón "Guardar" → `DL.save(EPK)` → persiste en localStorage + Supabase
- **Exportar:** Genera HTML standalone con todos los datos embebidos (portable, sin dependencias)
- **Restaurar:** Reset a los datos originales embebidos en `<script id="epk-data">`

**Flujo de guardado:**
```
Admin edita campo → colecta tab → actualiza EPK → DL.save(EPK) → renderAll()
                                                      ↓              ↓
                                               localStorage     Supabase upsert
                                             + timestamp local  + updated_at
```

---

## 8. SUPABASE — SCHEMA Y CONFIGURACIÓN

### Tablas requeridas (aplicar en cada proyecto nuevo)

```sql
-- Tabla principal del EPK
CREATE TABLE public.epk (
  slug text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla de analytics de vistas
CREATE TABLE public.epk_views (
  id bigserial PRIMARY KEY,
  slug text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

-- RLS policies — epk
ALTER TABLE public.epk ENABLE ROW LEVEL SECURITY;
CREATE POLICY "epk_select_public" ON public.epk FOR SELECT USING (true);
CREATE POLICY "epk_insert_anon"   ON public.epk FOR INSERT WITH CHECK (true);
CREATE POLICY "epk_update_anon"   ON public.epk FOR UPDATE USING (true) WITH CHECK (true);

-- RLS policies — epk_views
ALTER TABLE public.epk_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "epk_views_insert_anon" ON public.epk_views FOR INSERT WITH CHECK (true);
CREATE POLICY "epk_views_select_anon" ON public.epk_views FOR SELECT USING (true);
```

### Storage bucket para fotos

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('epk-assets', 'epk-assets', true, 10485760,
        ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "epk_assets_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'epk-assets');
CREATE POLICY "epk_assets_anon_insert"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'epk-assets');
CREATE POLICY "epk_assets_anon_update"  ON storage.objects FOR UPDATE USING (bucket_id = 'epk-assets');
CREATE POLICY "epk_assets_anon_delete"  ON storage.objects FOR DELETE USING (bucket_id = 'epk-assets');
```

### Subir fotos al Storage (curl)

```bash
curl -X POST "https://{PROJECT_ID}.supabase.co/storage/v1/object/epk-assets/{SLUG}/photos/{filename}.jpg" \
  -H "Authorization: Bearer {ANON_KEY}" \
  -H "Content-Type: image/jpeg" \
  -H "x-upsert: true" \
  --data-binary "@/ruta/local/foto.jpg"
```

**URL pública resultante:**
```
https://{PROJECT_ID}.supabase.co/storage/v1/object/public/epk-assets/{SLUG}/photos/{filename}.jpg
```

### Estructura de carpetas en Storage por DJ

```
epk-assets/
  {slug}/
    photos/
      hero.jpg
      editorial-1.jpg
      editorial-2.jpg
      editorial-3.jpg
      press-1.jpg
      press-2.jpg
      press-3.jpg
      press-4.jpg
    logos/
      logo-color.png
      logo-negro.png
```

---

## 9. PLACEHOLDERS EN EL TEMPLATE

El archivo `index.html` del template repo tiene estos placeholders que deben reemplazarse:

| Placeholder | Reemplazar con | Ocurrencias |
|---|---|---|
| `%%SUPABASE_URL%%` | `https://{project_id}.supabase.co` | 1 |
| `%%SUPABASE_KEY%%` | Supabase publishable key (`sb_publishable_...`) | 1 |
| `%%EPK_SLUG%%` | Slug del artista, ej. `nawel-lopez` | 7 |
| `%%ARTIST_NAME%%` | Nombre display, ej. `Nawel Lopez` | 2 |
| `%%ARTIST_TAGLINE%%` | Tagline corto | 1 |
| `--pu:#c026d3` | Color primario hex | 1 |
| `--pur:192,38,211` | Mismo color como `R,G,B` | 1 |
| `--pu2:#7c3aed` | Color hover hex | 1 |

También reemplazar el contenido de `<script id="epk-data">` con el EPK object del artista.

**Script Python para hacer los reemplazos:**

```python
import re, json

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Datos del artista
SLUG = 'nawel-lopez'
ARTIST_NAME = 'Nawel Lopez'
ARTIST_TAGLINE = 'La Reina del House'
SB_URL = 'https://XXXXXXXXXXX.supabase.co'
SB_KEY = 'sb_publishable_...'
PRIMARY_COLOR = '#e91e8c'
PRIMARY_RGB = '233,30,140'
HOVER_COLOR = '#db2777'

html = html.replace('%%SUPABASE_URL%%', SB_URL)
html = html.replace('%%SUPABASE_KEY%%', SB_KEY)
html = html.replace('%%EPK_SLUG%%', SLUG)
html = html.replace('%%ARTIST_NAME%%', ARTIST_NAME)
html = html.replace('%%ARTIST_TAGLINE%%', ARTIST_TAGLINE)
html = html.replace('--pu:#c026d3', f'--pu:{PRIMARY_COLOR}')
html = html.replace('--pur:192,38,211', f'--pur:{PRIMARY_RGB}')
html = html.replace('--pu2:#7c3aed', f'--pu2:{HOVER_COLOR}')

# Reemplazar EPK data
epk_object = { ... }  # El objeto completo del artista
new_json = json.dumps(epk_object, indent=2, ensure_ascii=False)
html = re.sub(
    r'(<script[^>]+id=["\']epk-data["\'][^>]*>)([\s\S]*?)(</script>)',
    f'\\g<1>\n{new_json}\n\\g<3>',
    html, count=1
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
```

---

## 10. PROCESO COMPLETO — NUEVO EPK PASO A PASO

### PASO 1: Supabase

1. Crear proyecto en supabase.com (org: `agocbdvenolaqubwrtvf`, región: `us-east-2`)
2. Esperar que esté `ACTIVE_HEALTHY` (~2 min)
3. Obtener Project ID y publishable key (`sb_publishable_...`)
4. Aplicar migrations de schema (tablas `epk` y `epk_views`)
5. Crear bucket `epk-assets` en Storage
6. Subir fotos del artista al bucket (`{slug}/photos/`, `{slug}/logos/`)
7. Hacer seed inicial: `INSERT INTO public.epk (slug, data) VALUES ('{slug}', '{json}'::jsonb)`

### PASO 2: GitHub

1. Crear repo `nawemediagmail/dj-{slug}-epk` (público, sin init)
2. Clonar template: `git clone https://{PAT}@github.com/Nawemediagmail/dj-epk-template.git`
3. Procesar `index.html` con el script Python (reemplazar placeholders + EPK data)
4. Push inicial a main

### PASO 3: Vercel

```bash
VERCEL_TOKEN="..."
TEAM_ID="team_AJK3ksf0robM6Pr8nJ3tSIrh"

# Crear proyecto
curl -X POST "https://api.vercel.com/v10/projects?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dj-{slug}-epk",
    "framework": null,
    "gitRepository": {"type": "github", "repo": "nawemediagmail/dj-{slug}-epk"}
  }'
# Guardar el "id" del response (prj_...)

# Agregar dominio apex
curl -X POST "https://api.vercel.com/v10/projects/{PROJECT_ID}/domains?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "{domain}"}'

# Agregar www con redirect 308
curl -X POST "https://api.vercel.com/v10/projects/{PROJECT_ID}/domains?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "www.{domain}", "redirect": "{domain}", "redirectStatusCode": 308}'

# Disparar primer deploy
curl -X POST "https://api.vercel.com/v13/deployments?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dj-{slug}-epk",
    "project": "{PROJECT_ID}",
    "target": "production",
    "gitSource": {"type": "github", "org": "nawemediagmail", "repo": "dj-{slug}-epk", "ref": "main"}
  }'
```

### PASO 4: DNS en Cloudflare

Agregar en dash.cloudflare.com → Zona del dominio → DNS:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | **OFF** (DNS only, nube gris) |
| CNAME | `www` | `cname.vercel-dns.com` | **OFF** (DNS only, nube gris) |

**⚠️ El proxy de Cloudflare DEBE estar OFF** — si está activo (nube naranja), Vercel no puede emitir el certificado SSL y el dominio no funciona.

Si el token de Cloudflare tiene restricción de IP, hacerlo manual en el dashboard.

### PASO 5: Verificación

```bash
# Verificar deploy
curl -s -o /dev/null -w "%{http_code}" "https://{domain}" -L --max-time 15
# Debe devolver 200

# Verificar www redirect
curl -s -o /dev/null -w "%{http_code} → %{url_effective}" "https://www.{domain}" -L
# Debe devolver 200 → https://{domain}
```

---

## 11. VERCEL CONFIG (`vercel.json`)

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 12. SECCIONES DEL EPK — RENDER FUNCTIONS

Cada sección es una función pura que devuelve HTML string:

| Función | Datos usados | Descripción |
|---|---|---|
| `renderHero()` | `EPK.artist`, `EPK.shows` | Hero full-screen con foto, nombre, genres, stats, countdown al próximo show |
| `renderBio()` | `EPK.bio`, `EPK.artist` | Tabs ES/EN/PT, foto lateral, stats |
| `renderMusic()` | `EPK.music` | Iframes de SoundCloud embebidos |
| `renderShows()` | `EPK.shows` | Lista de fechas con badges de status |
| `renderGallery()` | `EPK.gallery` | Grid masonry con categorías (lifestyle/prensa/shows) |
| `renderPressKit()` | `EPK.presskit` | Links de descarga con iconos |
| `renderFooter()` | `EPK.artist`, `EPK.social` | Links sociales, contacto |

`renderAll()` los compone todos en `<main id="main">`.

**Para agregar una nueva sección:**
1. Crear `function renderNuevaSeccion()` que retorne HTML string usando `EPK`
2. Agregar al array en `renderAll()`: `[renderHero(), ..., renderNuevaSeccion()]`
3. Opcionalmente agregar tab en el admin panel en `renderTab()`

---

## 13. BUGS CONOCIDOS Y FIXES APLICADOS

### Bug 1: Admin no guardaba cambios (resuelto)
**Causa:** `DL.sync()` descargaba datos de Supabase en cada refresh y sobreescribía localStorage incondicionalmente.  
**Fix:** Sistema de timestamps doble — `DL.save()` guarda timestamp en localStorage Y en Supabase. `DL.sync()` solo aplica datos remotos si `supabase.updated_at > localStorage_timestamp`.

### Bug 2: Página congelada en loader (resuelto)
**Causa:** La CDN de Supabase (`cdn.jsdelivr.net`) se cargaba de forma síncrona (`<script src="...">`). Si la CDN era lenta o estaba bloqueada (redes de LatAm), bloqueaba toda la ejecución de JS incluyendo el `setTimeout` que oculta el loader.  
**Fix:** Eliminar el `<script src>` síncrono. Cargar Supabase dinámicamente con `document.createElement('script')` + `s.async=true` DESPUÉS de que `renderAll()` haya ejecutado. El sitio siempre renderiza desde localStorage/data embebida; Supabase es un enhancement posterior.

```javascript
// CORRECTO — Supabase async después del render inicial
renderAll();
(function(){
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  s.async = true;
  s.onload = function() {
    _sb = supabase.createClient(_SB_URL, _SB_KEY);
    // analytics + sync van aquí
  };
  document.head.appendChild(s);
})();
```

---

## 14. ANALYTICS

### Ver vistas del EPK en Supabase

```sql
-- Total de vistas
SELECT COUNT(*) FROM public.epk_views WHERE slug = 'ambar-lombardi';

-- Vistas por día (últimos 30 días)
SELECT DATE(viewed_at) as dia, COUNT(*) as vistas
FROM public.epk_views
WHERE slug = 'ambar-lombardi'
  AND viewed_at > now() - interval '30 days'
GROUP BY dia
ORDER BY dia DESC;

-- Vistas por hora del día
SELECT EXTRACT(HOUR FROM viewed_at) as hora, COUNT(*) as vistas
FROM public.epk_views
WHERE slug = 'ambar-lombardi'
GROUP BY hora
ORDER BY hora;
```

---

## 15. MODIFICACIONES FRECUENTES

### Agregar un show
Panel admin → tab "Shows" → "Nuevo Show" → completar campos → Guardar.

O directamente en Supabase:
```sql
UPDATE public.epk
SET data = jsonb_set(
  data,
  '{shows}',
  data->'shows' || '[{"id":99,"date":"2026-08-15","venue":"Club Nuevo","city":"Lima","country":"Perú","type":"Club Show","status":"upcoming","ticketUrl":"#"}]'::jsonb
)
WHERE slug = 'ambar-lombardi';
```

### Cambiar foto hero
Panel admin → tab "Artista" → campo "Hero Photo" → pegar URL de Supabase Storage.

URL formato: `https://{project_id}.supabase.co/storage/v1/object/public/epk-assets/{slug}/photos/nueva-foto.jpg`

### Agregar set de SoundCloud
1. Ir al set en SoundCloud
2. Click "Share" → "Embed" → copiar el `src` del iframe
3. Panel admin → tab "Música" → "Nuevo set" → pegar embed URL → Guardar

### Cambiar contraseña admin
Panel admin → tab "Config" → campo nueva contraseña → Guardar.

---

## 16. REPOSITORIOS Y ARCHIVOS CLAVE

| Repo | Branch | Contenido |
|---|---|---|
| `nawemediagmail/dj-epk-template` | `main` | Template con placeholders, `vercel.json`, `CLAUDE.md` |
| `nawemediagmail/dj-ambarlombardi-epk` | `main` | EPK producción de Ambar Lombardi |

### Archivos en cada repo EPK

```
/
├── index.html          # Toda la app (HTML + CSS + JS ~1200 líneas)
├── vercel.json         # Config de Vercel
├── CLAUDE.md           # Documentación técnica para AI
└── assets/             # Fotos locales (se usan si Storage falla)
    ├── logo-color.png
    ├── logo-negro.png
    └── photos/
        ├── hero.jpg
        ├── editorial-*.jpg
        └── press-*.jpg
```

**Nota sobre assets**: Las fotos están en Supabase Storage como fuente primaria. La carpeta `assets/` en el repo es un backup. Las URLs en el EPK apuntan a Supabase Storage.

---

## 17. EPK EXISTENTES

### Ambar Lombardi
- **URL:** https://ambarlombardi.com
- **Repo:** `nawemediagmail/dj-ambarlombardi-epk`
- **Supabase project ID:** `qbpjuuesgsrotsagorcr`
- **Slug:** `ambar-lombardi`
- **Admin password:** `ambarlombardi2026`
- **Color:** `#c026d3` (purple) / hover `#7c3aed` (indigo)
- **Storage:** `https://qbpjuuesgsrotsagorcr.supabase.co/storage/v1/object/public/epk-assets/ambar-lombardi/`

---

## 18. CHECKLIST NUEVO EPK

```
□ Datos del artista recopilados (nombre, slug, tagline, bio 3 idiomas, shows, redes)
□ Fotos recibidas (hero, bio, editorial x2, press x3 mínimo)
□ Dominio disponible o existente confirmado

□ Supabase proyecto creado (ACTIVE_HEALTHY)
□ Migrations aplicadas (epk + epk_views + Storage bucket)
□ Fotos subidas a Storage ({slug}/photos/ y {slug}/logos/)
□ Seed inicial insertado en public.epk

□ Repo GitHub creado (dj-{slug}-epk)
□ Template clonado y procesado (placeholders reemplazados + EPK data)
□ Push a main exitoso

□ Proyecto Vercel creado y vinculado a GitHub
□ Dominio apex agregado a Vercel
□ www agregado con redirect 308
□ Deploy disparado y READY

□ DNS Cloudflare configurado (A record + CNAME, proxy OFF)
□ ambarlombardi.com responde HTTP 200
□ www.{domain} redirige a apex
□ SSL activo (https funciona)
□ Panel admin accesible (⚙️ → contraseña → guarda correctamente)
□ Refresh después de guardar mantiene los cambios
```
