# Setup Completo para DJ SARRIA EPK

## Status Actual
✅ **Completado:**
- EPK generado (`djs/dj-sarria/index.html`)
- Datos embebidos (biografía, shows, música, redes)
- Rama creada y pusheada: `claude/funny-hawking-2nXZk`

⏳ **Pendiente:**
- Proyecto Supabase
- Repositorio GitHub
- Deploy en Vercel
- Subida de fotos

---

## 1️⃣ Supabase Setup (REQUERIDO)

### Problema Actual
La organización NAWEMEDIA ha alcanzado el límite de 2 proyectos gratuitos.

**Soluciones:**
- [ ] **Opción A**: Pausar/eliminar un proyecto existente
- [ ] **Opción B**: Actualizar a plan Pro ($25/mes)
- [ ] **Opción C**: Compartir proyecto entre múltiples EPKs

### Una vez resuelto, ejecutar:

```bash
# 1. Crear proyecto en supabase.com
# Org: NAWEMEDIA (agocbdvenolaqubwrtvf)
# Nombre: dj-sarria-epk
# Región: us-east-2
# Plan: Free

# 2. Ejecutar SQL (en Supabase Dashboard → SQL Editor):
CREATE TABLE public.epk (
  slug text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.epk_views (
  id bigserial PRIMARY KEY,
  slug text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.epk ENABLE ROW LEVEL SECURITY;
CREATE POLICY "epk_select_public" ON public.epk FOR SELECT USING (true);
CREATE POLICY "epk_insert_anon" ON public.epk FOR INSERT WITH CHECK (true);
CREATE POLICY "epk_update_anon" ON public.epk FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE public.epk_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "epk_views_insert_anon" ON public.epk_views FOR INSERT WITH CHECK (true);
CREATE POLICY "epk_views_select_anon" ON public.epk_views FOR SELECT USING (true);

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('epk-assets', 'epk-assets', true, 10485760,
        ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "epk_assets_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'epk-assets');
CREATE POLICY "epk_assets_anon_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'epk-assets');
CREATE POLICY "epk_assets_anon_update" ON storage.objects FOR UPDATE USING (bucket_id = 'epk-assets');
CREATE POLICY "epk_assets_anon_delete" ON storage.objects FOR DELETE USING (bucket_id = 'epk-assets');

-- Seed inicial
INSERT INTO public.epk (slug, data) 
VALUES ('dj-sarria', '{"artist":{"name":"SARRIA"}}');
```

# 3. Obtener credenciales

En Supabase Dashboard → Project Settings → API:
- **Project ID**: Copiar (ej: `qbpjuuesgsrotsagorcr`)
- **Publishable Key** (sb_publishable_...): Copiar

---

## 2️⃣ GitHub Setup

### Crear repositorio manualmente:

1. Ve a https://github.com/new
2. **Repository name**: `dj-sarria-epk`
3. **Description**: `Electronic Press Kit para DJ SARRIA — Tribal, Circuit, House`
4. **Visibility**: Public
5. **Initialize with**: None (sin README)
6. Click "Create repository"

### Push del código local:

```bash
cd /home/user/nawemedia-epks/djs/dj-sarria/

git init
git add .
git commit -m "Initial EPK setup for SARRIA"
git branch -M main
git remote add origin https://github.com/Nawemediagmail/dj-sarria-epk.git
git push -u origin main
```

---

## 3️⃣ Actualizar index.html con credenciales

Una vez tengas Project ID y Publishable Key de Supabase:

**En `index.html`, líneas 562-563, reemplaza:**

```javascript
// ANTES:
const _SB_URL = 'https://{{PROJECT_ID}}.supabase.co';
const _SB_KEY = 'sb_publishable_{{ANON_KEY}}';

// DESPUÉS:
const _SB_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const _SB_KEY = 'sb_publishable_YOUR_ANON_KEY';
```

También actualiza las URLs de fotos en `epk-data.json`:

```json
"heroPhoto": "https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/epk-assets/dj-sarria/photos/hero.jpg"
```

---

## 4️⃣ Descargar y subir fotos

### Descargar desde Google Drive:

[Google Drive Folder](https://drive.google.com/drive/folders/12K-CBS6Xb1HPr_xnfUghls5Z6jo_4I8w)

Descargar y renombrar:
```
PHOTO_HERO.jpeg          → hero.jpg
PHOTO_EDITORIAL V01.jpeg → editorial-1.jpg
PHOTO_EDITORIAL V02.jpeg → editorial-2.jpg
PHOTO_PRENSA V01.jpeg    → prensa-1.jpg
PHOTO_PRENSA V02.jpeg    → prensa-2.jpg
PHOTO_PRENSA V03.jpeg    → prensa-3.jpg
LOGO_COLOR.png           → logo-color.png
LOGO_NEGRO.png           → logo-negro.png
BACKGROUND.jpg           → background.jpg
```

### Subir a Supabase Storage:

En Supabase Dashboard → Storage:

1. Click en bucket `epk-assets`
2. Crear carpeta: `dj-sarria/photos`
3. Subir todos los JPGs
4. Crear carpeta: `dj-sarria/logos`
5. Subir PNGs

O vía curl (después de descargar):

```bash
PROJECT_ID="YOUR_PROJECT_ID"
ANON_KEY="YOUR_ANON_KEY"

curl -X POST "https://${PROJECT_ID}.supabase.co/storage/v1/object/epk-assets/dj-sarria/photos/hero.jpg" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: image/jpeg" \
  -H "x-upsert: true" \
  --data-binary "@hero.jpg"
```

---

## 5️⃣ Vercel Deployment

### Crear proyecto en Vercel:

1. Ve a https://vercel.com/dashboard
2. **New Project**
3. **Import Git Repository**: `Nawemediagmail/dj-sarria-epk`
4. **Project Settings**:
   - **Name**: `dj-sarria-epk`
   - **Root Directory**: `/` (default)
   - **Build Command**: None (static site)
5. Click **Deploy**

Vercel generará una URL como: `https://dj-sarria-epk.vercel.app`

---

## 6️⃣ DNS Custom Domain (Opcional)

Cuando tengas dominio comprado (ej: `sarriadj.com`):

En Vercel → Project → Domains:
1. Add Custom Domain
2. Ingresa el dominio
3. Vercel te dará los records de DNS

En Cloudflare (si usas Cloudflare):
```
A record:  @ → 76.76.21.21 (DNS only)
CNAME:     www → cname.vercel-dns.com (DNS only)
```

---

## Checklist Final

```
□ Problema de límite Supabase resuelto
□ Proyecto creado en Supabase (dj-sarria-epk)
□ Tablas y policies creadas
□ Bucket epk-assets creado
□ Project ID y Publishable Key obtenidos

□ Repositorio creado en GitHub (dj-sarria-epk)
□ Código pusheado a main

□ index.html actualizado con credenciales de Supabase
□ epk-data.json actualizado con URLs de fotos

□ Fotos descargadas y renombradas
□ Fotos subidas a Supabase Storage

□ Proyecto creado en Vercel
□ Deploy exitoso en vercel.app

□ (Opcional) Dominio custom configurado en Cloudflare
```

---

## Referencias

- Documentación completa: `NAWEMEDIA_EPK_SYSTEM.md`
- EPK Template: `template/`
- EPK de referencia (Ambar): `djs/ambar-lombardi/`

## Admin Access

Una vez deployed:
- URL: `https://dj-sarria-epk.vercel.app`
- Panel admin: Click ⚙️ en navbar
- Password: `sarria2026`
