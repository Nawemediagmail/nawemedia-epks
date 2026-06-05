# NAWEMEDIA DJ EPK — Intake y referencia de datos

> Este documento define qué información recopilar de un DJ nuevo y el formato exacto en que debe estructurarse para crear su EPK.

---

## FORMULARIO DE INTAKE — Preguntar al DJ

### Identidad artística
- **Nombre artístico completo** (display): ej. "Ambar Lombardi"
- **Slug URL** (minúsculas, solo guiones): ej. `ambar-lombardi`
- **Tagline** (frase que lo define, máx 6 palabras): ej. "La Diva del Tribal"
- **Ubicación**: ej. "Perú · Venezuela"
- **Géneros musicales** (2-4): ej. Tribal, House, Circuit

### Estadísticas
- **Año de debut** como DJ profesional
- **Shows realizados** (aproximado): ej. "50+", "200+"
- **Países donde ha tocado**: número

### Contacto
- **Email de booking**
- **WhatsApp** (con código de país): ej. +51913196019

### Contraseña del panel admin
- Proponer formato: `{nombre}{año}` — ej. `nawel2026`

### Redes sociales (URLs completas, dejar vacío si no tiene)
- Instagram
- SoundCloud
- YouTube
- Facebook
- Spotify
- TikTok

### Dominio
- **Dominio deseado**: ej. `nawellopez.com`
- ¿Ya tiene el dominio? ¿Dónde está registrado?

### Color de marca
- **Color primario** (hex): ej. `#e91e8c`
  - Si no sabe, preguntar por su "color favorito" o color de su logo
  - Referencia: Ambar usa `#c026d3` (púrpura), ajustar según identidad del artista
- **Color secundario/hover** (hex, puede ser más oscuro del primario): ej. `#db2777`

### Fotos (mínimo necesario)
- 1 foto **hero** (fondo, paisaje, alta resolución) — la más impactante
- 1 foto **bio** (retrato, buena luz)
- 2-3 fotos **editoriales** (lifestyle, sesiones de fotos)
- 2-3 fotos de **prensa** (shows, performance, backstage)
- Logo (PNG con fondo transparente, versión color y versión negra/blanca)

### Biografía (en los 3 idiomas si es posible, mínimo español)
Estructura sugerida para cada idioma:
- **Lede** (1 sola frase que define al artista): quién es, de dónde viene, qué lo hace único
- **Body** (2-3 párrafos separados por línea en blanco):
  - Párrafo 1: Orígenes y propuesta musical
  - Párrafo 2: Shows destacados, venues, hitos de carrera
  - Párrafo 3: Proyección actual / internacional

### Shows próximos (si tiene)
Por cada show:
- Fecha (YYYY-MM-DD)
- Nombre del venue
- Ciudad
- País
- Tipo (Club Show / Festival / Private / Residency)
- Link de tickets (o `#` si no hay)

### Sets de SoundCloud
Por cada set:
- Título del set
- URL de SoundCloud del set (ej. `https://soundcloud.com/artista/nombre-del-set`)

Para generar el embed URL:
1. Ir al set en SoundCloud
2. Click "Share" → "Embed"
3. Copiar el valor del atributo `src` del iframe

### Press Kit (descargas)
Por cada item descargable:
- Nombre: ej. "Fotos HD", "Rider técnico", "Bio oficial"
- Formato: JPG / PDF / ZIP
- URL de Google Drive (con acceso público para cualquier persona con el link)
- Emoji icon: 📷 fotos · 📰 prensa · 🎚️ rider · 📄 bio · 🎵 música

---

## FORMATO JSON COMPLETO — EPK Object

Este es el objeto exacto que va en `<script id="epk-data">` y en Supabase. Usar como plantilla:

```json
{
  "artist": {
    "name": "Nombre Artístico",
    "tagline": "Tagline corto aquí",
    "location": "Ciudad · País",
    "contact": "booking@email.com",
    "whatsapp": "+XXXXXXXXXXX",
    "heroPhoto": "https://{project}.supabase.co/storage/v1/object/public/epk-assets/{slug}/photos/hero.jpg",
    "bioPhoto": "https://{project}.supabase.co/storage/v1/object/public/epk-assets/{slug}/photos/bio.jpg",
    "genres": ["Género 1", "Género 2", "Género 3"],
    "stats": {
      "debut": "2023",
      "shows": "100+",
      "countries": "5"
    }
  },
  "bio": {
    "es": {
      "lede": "Una sola frase que define al artista en español.",
      "body": "Primer párrafo. Orígenes, propuesta musical, sonido característico.\n\nSegundo párrafo. Venues, shows destacados, hitos de carrera.\n\nTercer párrafo. Proyección actual, fechas internacionales, próximos pasos."
    },
    "en": {
      "lede": "One single sentence that defines the artist in English.",
      "body": "First paragraph in English.\n\nSecond paragraph.\n\nThird paragraph."
    },
    "pt": {
      "lede": "Uma única frase que define o artista em português.",
      "body": "Primeiro parágrafo em português.\n\nSegundo parágrafo.\n\nTerceiro parágrafo."
    }
  },
  "shows": [
    {
      "id": 1,
      "date": "2026-08-15",
      "venue": "Nombre del Club",
      "city": "Ciudad",
      "country": "País",
      "type": "Club Show",
      "status": "upcoming",
      "ticketUrl": "https://..."
    }
  ],
  "gallery": [
    {
      "id": 1,
      "url": "https://{storage}/photos/editorial-1.jpg",
      "caption": "Descripción breve",
      "category": "lifestyle",
      "span": "feat"
    },
    {
      "id": 2,
      "url": "https://{storage}/photos/press-1.jpg",
      "caption": "Press portrait",
      "category": "prensa",
      "span": "tall"
    },
    {
      "id": 3,
      "url": "https://{storage}/photos/hero.jpg",
      "caption": "Nombre del artista",
      "category": "prensa",
      "span": ""
    },
    {
      "id": 4,
      "url": "https://{storage}/photos/press-2.jpg",
      "caption": "Stage energy",
      "category": "shows",
      "span": ""
    },
    {
      "id": 5,
      "url": "https://{storage}/photos/editorial-2.jpg",
      "caption": "Editorial",
      "category": "lifestyle",
      "span": ""
    },
    {
      "id": 6,
      "url": "https://{storage}/photos/press-3.jpg",
      "caption": "Performance",
      "category": "shows",
      "span": "wide"
    }
  ],
  "music": [
    {
      "id": 1,
      "title": "Nombre del Set",
      "type": "set",
      "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2F{artista}%2F{set}&color=%23{COLOR_HEX_SIN_#}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
    }
  ],
  "presskit": {
    "description": "Descargas directas para prensa, promotores y productoras.",
    "items": [
      {
        "id": 1,
        "name": "Fotos HD",
        "size": "Drive",
        "format": "JPG",
        "url": "https://drive.google.com/drive/folders/...",
        "icon": "📷"
      },
      {
        "id": 2,
        "name": "Rider técnico",
        "size": "Drive",
        "format": "PDF",
        "url": "https://drive.google.com/drive/folders/...",
        "icon": "🎚️"
      }
    ]
  },
  "social": {
    "instagram": "https://www.instagram.com/usuario/",
    "soundcloud": "https://soundcloud.com/usuario",
    "youtube": "https://www.youtube.com/@usuario",
    "facebook": "https://www.facebook.com/usuario",
    "spotify": "",
    "tiktok": ""
  },
  "admin": {
    "password": "contraseña2026"
  }
}
```

---

## REFERENCIA DE GALLERY SPANS

El campo `span` controla el tamaño visual de cada foto en el grid:

| Valor | Efecto visual | Usar para |
|---|---|---|
| `"feat"` | Grande (2 columnas + 2 filas) | La foto más impactante, va primero |
| `"tall"` | Alta (1 columna + 2 filas) | Retratos verticales, fotos de cuerpo entero |
| `"wide"` | Ancha (2 columnas + 1 fila) | Fotos paisaje, stage shots, grupos |
| `""` | Normal (1×1) | Fotos cuadradas o restantes |

**Distribución recomendada para 9 fotos:**
```
feat, tall, normal, normal, normal, wide, normal, tall, normal
```

---

## CATEGORÍAS DE GALLERY

| Valor | Descripción |
|---|---|
| `"lifestyle"` | Editoriales, sesiones de fotos artísticas, backstage |
| `"prensa"` | Retratos oficiales, fotos para medios |
| `"shows"` | Fotos en performance, en el escenario, con el público |

---

## EMBED URL DE SOUNDCLOUD — Cómo obtenerlo

1. Abrir el set/track en soundcloud.com
2. Click en **"Share"** → tab **"Embed"**
3. Copiar el código del iframe que aparece
4. Del iframe, extraer el valor del atributo `src`

El `src` se ve así:
```
https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2F{artista}%2F{set}&color=%23ff5500&...
```

Cambiar `color=%23ff5500` por `color=%23{COLOR_SIN_#}` del artista.
Ejemplo para color `#e91e8c` → `color=%23e91e8c`

---

## EPK DE REFERENCIA — Ambar Lombardi (producción)

URL: https://ambarlombardi.com  
Repo: github.com/Nawemediagmail/dj-ambarlombardi-epk  
Color: `#c026d3` (púrpura) + hover `#7c3aed` (índigo)  
Slug: `ambar-lombardi`  
Storage: `https://qbpjuuesgsrotsagorcr.supabase.co/storage/v1/object/public/epk-assets/ambar-lombardi/`

---

## PROMPT SUGERIDO PARA INICIAR UN NUEVO EPK EN PERPLEXITY

```
Necesito crear un EPK para un nuevo DJ. Tengo el sistema NAWEMEDIA documentado.
Por favor hazme las preguntas del formulario de intake una sección a la vez,
y cuando tenga toda la información, genera el EPK JSON completo listo para
pegar en el sistema, y dime los pasos exactos a seguir para el setup técnico.

DJ: [nombre del DJ]
```
