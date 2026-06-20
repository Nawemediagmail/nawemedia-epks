# epk-admin

**Documenta, depura y extiende el Panel de Administración de los EPKs de NAWEMEDIA.**

## Descripción

El Admin Panel es un modal HTML/JS embebido directamente en cada `index.html` de los DJs.
Permite editar todos los datos del EPK en vivo sin tocar código:
Bio, Música, Galería (con subida de fotos), Sociales y Stats.
Los cambios se persisten en GitHub vía la API de Vercel (`/api/epk-save`).

## Uso

```
/epk-admin [acción]
```

### Acciones disponibles

```
/epk-admin debug          — diagnosticar por qué no guarda / no carga
/epk-admin add-tab        — agregar nueva pestaña al panel
/epk-admin change-password — cambiar contraseña de acceso
/epk-admin audit dj-slug  — revisar que el panel esté completo en un DJ
```

## Cómo Abrir el Panel

| Método | Acción |
|---|---|
| Teclado | `Ctrl + Alt + A` |
| Botón | Ícono ⚙ en la barra de navegación |

**Contraseña por DJ:**

| DJ | Password |
|---|---|
| dj-fay | `fay2025` |
| dj-bini | `demo2026` |
| (nuevos) | definida en `login()` dentro del `<script>` |

---

## Arquitectura del Panel

### Flujo de datos

```
Página carga
    → loadFromGitHub()          GET /api/epk-load?slug=DJ_SLUG
    → adminData = defaultData + result.data (merge)

Usuario abre admin + login
    → renderAdmin()             puebla los formularios HTML con adminData

Usuario edita y guarda
    → lee inputs del DOM → actualiza adminData
    → saveData()                POST /api/epk-save  { slug, data: adminData }
    → GitHub escribe epk-data.json en el repo

Foto subida (galería o hero)
    → uploadPhotoToGithub(file, isHero)
    → POST /api/upload-photo    { fileData (base64), fileName, slug }
    → GitHub guarda assets/photo-{ts}.jpg
    → retorna { url: "https://raw.githubusercontent.com/..." }
    → adminData actualizado → saveData() automático
```

### Variables clave en el `<script>`

```js
const DJ_SLUG = "dj-fay";          // slug único — DEBE coincidir con epk-data.json
let adminData = {...defaultData};   // estado en memoria del panel
let isAuth = false;                 // true tras login correcto
```

### API Endpoints (Vercel serverless)

| Endpoint | Método | Cuerpo | Respuesta |
|---|---|---|---|
| `/api/epk-load` | GET | `?slug=dj-fay` | `{ data: {...} }` |
| `/api/epk-save` | POST | `{ slug, data }` | `{ ok: true }` |
| `/api/upload-photo` | POST | `{ fileData, fileName, slug }` | `{ url }` |

Fuente real: `epk-data.json` en `djs/{slug}/epk-data.json` del repo GitHub.

---

## Pestañas del Panel

### Bio
- Campos: `bio-es` (textarea ES), `bio-en` (textarea EN)
- Hero photo: preview + botón `📤 Reemplazar Foto Hero`
  - Input file → base64 → `/api/upload-photo` con `isHero=true`
  - Actualiza `adminData.hero_photo` y `<img id="hero-photo-img">`

### Music
- Lista dinámica de tracks: title, type (`set` | `release`), url (embed SoundCloud)
- Botón `+ Add Track` → push vacío → `renderAdmin()`
- Botón `Remove` → `adminData.music.splice(i,1)` → `renderAdmin()`

### Gallery
- Lista de fotos: src (URL), cap (caption)
- Subida directa: input file → `uploadPhotoToGithub(file, false)`
  - Genera `photo-{timestamp}.jpg` en `assets/`
  - URL raw de GitHub se guarda en `adminData.gallery`
- Límite: **2MB por foto**
- Botón `+ Add Manual Photo Link` → URL externa directa

### Socials
- Lista: plat (plataforma), handle, url
- Add / Remove dinámico

### Stats
- Campos: `stats-toques`, `stats-paises`, `stats-activo`
- Al guardar llama `updateStats()` → actualiza los `<span>` del hero en tiempo real

---

## Funciones JS Clave

```js
// Carga datos desde GitHub al abrir el panel
async function loadFromGitHub()

// Puebla todos los formularios del admin con adminData
function renderAdmin()

// Actualiza los contadores del hero en la página pública
function updateStats()

// Actualiza la foto del hero en la página pública
function updateHeroPhoto()

// Reconstruye la galería pública desde adminData.gallery
function renderGalleryPublic()

// Sube foto a GitHub vía /api/upload-photo
async function uploadPhotoToGithub(file, isHero)

// POST a /api/epk-save con todo adminData
async function saveData()
```

---

## Estructura HTML del Modal

```html
<div class="admin-modal" id="admin-modal">
  <div class="admin-panel">
    <div class="admin-header">...</div>

    <!-- Pantalla de login -->
    <div class="admin-body" id="login-screen">
      <input type="password" id="admin-pwd" />
      <button id="admin-login">Ingresar</button>
    </div>

    <!-- Contenido autenticado -->
    <div id="admin-content">
      <div class="admin-tabs-nav">
        <button data-tab="bio">Bio</button>
        <button data-tab="music">Music</button>
        <button data-tab="gallery">Gallery</button>
        <button data-tab="socials">Socials</button>
        <button data-tab="stats">Stats</button>
      </div>

      <div class="admin-tab active" data-tab="bio">...</div>
      <div class="admin-tab" data-tab="music">...</div>
      <div class="admin-tab" data-tab="gallery">...</div>
      <div class="admin-tab" data-tab="socials">...</div>
      <div class="admin-tab" data-tab="stats">...</div>

      <div class="admin-actions">
        <button id="admin-logout">Logout</button>
        <button id="admin-save-all">Save All</button>
      </div>
    </div>
  </div>
</div>
```

---

## Agregar una Nueva Pestaña

1. Agregar botón en `.admin-tabs-nav`:
   ```html
   <button class="admin-tab-btn" data-tab="video">Video</button>
   ```

2. Agregar bloque de pestaña:
   ```html
   <div class="admin-tab" data-tab="video">
     <h3>Video</h3>
     <div class="field-group">
       <label>URL del Video (YouTube embed)</label>
       <input type="text" id="video-url" placeholder="https://www.youtube.com/embed/..." />
     </div>
     <button class="admin-btn admin-btn--save" data-save="video">Save Video</button>
   </div>
   ```

3. Agregar case en el listener `[data-save]`:
   ```js
   else if(tab==="video"){
     adminData.video.url = document.getElementById("video-url").value;
   }
   ```

4. Agregar campo en `renderAdmin()`:
   ```js
   document.getElementById("video-url").value = adminData.video.url || "";
   ```

---

## Cambiar la Contraseña

Buscar en el `<script>` la función `login()`:

```js
function login(){
  if(adminPwd.value==="fay2025"){   // ← cambiar aquí
    isAuth=true;
    ...
  }
}
```

Reemplazar `"fay2025"` por la nueva contraseña y hacer commit.

---

## Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| "Save failed" en consola | `GITHUB_TOKEN` no configurado en Vercel | Settings → Environment Variables → agregar token |
| Fotos no se suben | Archivo > 2MB o formato no soportado | Comprimir imagen, usar JPG < 2MB |
| Datos no persisten al recargar | `DJ_SLUG` no coincide con nombre del JSON en GitHub | Verificar `const DJ_SLUG` en HTML == nombre del archivo `epk-data.json` |
| Panel no abre con Ctrl+Alt+A | Conflicto con keybinding del SO/browser | Usar el botón ⚙ en el nav |
| Bio no se actualiza en la página | `renderGalleryPublic()` / `updateStats()` no se llaman | Asegurarse de llamarlas después de `loadFromGitHub()` |
| Foto hero no cambia | `hero_photo` guardado pero `updateHeroPhoto()` no invocada | Llamar `updateHeroPhoto()` tras `loadFromGitHub()` |

---

## Checklist para Nuevo DJ (Admin Panel)

- [ ] `DJ_SLUG` seteado correctamente en `index.html`
- [ ] `epk-data.json` existe en `djs/{slug}/`
- [ ] `GITHUB_TOKEN` activo en variables de entorno de Vercel
- [ ] Contraseña definida en `login()` (y comunicada al artista)
- [ ] `loadFromGitHub()` llamada en `openAdmin()`
- [ ] `renderGalleryPublic()` llamada al cargar la página
- [ ] `updateStats()` y `updateHeroPhoto()` llamadas al cargar la página

## Related Skills

- `/new-dj` — crea la estructura completa de un DJ nuevo (incluye admin panel listo)
