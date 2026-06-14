# Guía: Agregar un Nuevo DJ al Monorepo

## Proceso Rápido (5 min)

### 1. Crear carpeta del DJ
```bash
mkdir -p djs/[dj-slug]/assets
cp template/index.html djs/[dj-slug]/
cp template/vercel.json djs/[dj-slug]/
```

**Reemplazar `[dj-slug]` con formato slug (ej: `dj-nombre` o `nombre-apellido`)**

### 2. Reemplazar configuración en el HTML

Abre `djs/[dj-slug]/index.html` y encuentra estas líneas (~línea 1555):

```javascript
const SUPABASE_URL = "https://qbpjuuesgsrotsagorcr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_HG3_rBYqqHIZHSfXVlaARA_clc2nNOf";
const DJ_SLUG = "dj-bini";  // ← CAMBIAR AQUÍ
```

Cambiar `DJ_SLUG` a tu slug (ej: `"dj-nombre"`).

### 3. Actualizar datos en la sección `defaultData` (~línea 1516)

```javascript
const defaultData = {
  bio: {
    en: "BINI is a Chilean DJ...",  // ← Bio en inglés
    es: "BINI es DJ chileno...",    // ← Bio en español
    de: "BINI ist ein chilenischer DJ..."  // ← Bio en alemán
  },
  music: [
    {id:1, title:"Track 1", type:"set", url:"https://w.soundcloud.com/player/..."}
  ],
  shows: [
    {id:1, date:"2026-07-18", venue:"Club Name", city:"City", country:"Country", type:"club", url:"#"}
  ],
  gallery: [
    {id:1, src:"assets/photo1.jpg", cap:"Caption"}
  ],
  socials: [
    {id:1, plat:"Instagram", handle:"@dj_handle", url:"https://instagram.com/..."}
  ]
  // ... resto de estructura
};
```

### 4. Subir fotos a assets
```bash
# Copiar fotos a djs/[dj-slug]/assets/
# Actualizar URLs en gallery y bios
```

### 5. Actualizar vercel.json (opcional si dominio es diferente)
```json
{
  "rewrites": [
    {
      "source": "/assets/:path*",
      "destination": "/djs/[dj-slug]/assets/:path*",
      "has": [{ "type": "host", "value": "[dj-domain].com" }]
    }
  ]
}
```

### 6. Crear fila en Supabase
**Datos se sincronizan automáticamente via admin panel.** Opcional: insertar seed data:

```sql
INSERT INTO epk (slug, data) VALUES (
  'dj-nombre',
  '{"bio":{"en":"...","es":"..."},"music":[],"shows":[],...}'::jsonb
);
```

### 7. Test local
```bash
# Servir en localhost:8000
python3 -m http.server 8000 --directory djs/[dj-slug]

# Admin panel: Ctrl+Alt+A (password: demo2026)
```

### 8. Commit y Push
```bash
git add djs/[dj-slug]/
git commit -m "feat: add [DJ Name] EPK

- Created DJ profile with admin panel
- Connected to Supabase for persistent data sync
- Template-based setup for scalability"

git push -u origin claude/[feature-branch]
```

---

## Estructura de Datos (JSON en Supabase)

La tabla `epk` guarda:

```json
{
  "bio": {
    "en": "English bio",
    "es": "Bio en español",
    "de": "Bio auf Deutsch"
  },
  "music": [
    {"id": 1, "title": "Set Name", "type": "set", "url": "SoundCloud embed URL"}
  ],
  "shows": [
    {
      "id": 1,
      "date": "2026-06-21",
      "venue": "Club Name",
      "city": "City",
      "country": "Country",
      "type": "club",
      "url": "#"
    }
  ],
  "gallery": [
    {"id": 1, "src": "assets/photo.jpg", "cap": "Caption"}
  ],
  "socials": [
    {"id": 1, "plat": "Instagram", "handle": "@dj_handle", "url": "https://..."}
  ],
  "video": {
    "url": "",
    "title": ""
  },
  "artist": {
    "name": "DJ Name",
    "tagline": "Tagline",
    "location": "City · Country",
    "genres": ["Genre1", "Genre2"],
    "contact": "email@example.com",
    "whatsapp": "+..."
  }
}
```

---

## Admin Panel

**Acceso:** Ctrl+Alt+A (o botón ⚙ en nav)  
**Contraseña:** `demo2026`

**Edita:**
- Bio (EN, ES, DE)
- Tracks de SoundCloud
- Shows (fecha, venue, ciudad, país)
- Galería (fotos + captions)
- Sociales (plataformas + handles)
- Video (URL y título)

**Nota:** Los cambios se guardan en Supabase automáticamente y sincronizan entre dispositivos.

---

## Slugs Actuales

| DJ | Slug | URL |
|---|---|---|
| Ambar Lombardi | `ambar-lombardi` | (migrando) |
| YEMIX | `yemix` | (migrando) |
| DJ BINI | `dj-bini` | https://djbini.com |

**Template:** `template/` (actualizado a Edge Functions)

---

## FAQ

### ¿Cómo cambio la contraseña del admin?
En el panel admin → Settings tab → cambiar password. Se guarda en Supabase.

### ¿Qué si los datos no se sincronizan?
- Verifica que el slug coincida entre HTML y Supabase
- Abre DevTools (F12) → Console para ver errores de red
- Edge Functions deben estar ACTIVE en Supabase

### ¿Puedo usar otro idioma además de EN/ES/DE?
Sí. Agrega en `defaultData.bio` y en el tab Bio del admin (requiere editar HTML).

### ¿Y si tengo muchas fotos?
Usa CloudFlare Images o GitHub para hostear. Actualiza URLs en `gallery` y bios.

---

## Próximos Pasos (30 DJs)
1. Repetir proceso para cada DJ
2. Actualizar vercel.json con dominios
3. Configurar DNS en Cloudflare (cada dominio → Vercel)
4. Crear PR y mergear a main

Tiempo estimado por DJ: **10 min** (una vez que los datos están listos)
