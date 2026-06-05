# Deploy Rápido de DJ SARRIA EPK en Netlify

## 🚀 En 2 minutos tendrás el EPK online

### Paso 1: Descargar el ZIP
El archivo está listo en: `/tmp/dj-sarria-epk.zip`

O descárgalo desde aquí (si tienes acceso al servidor):
```bash
scp user@server:/tmp/dj-sarria-epk.zip ./
```

### Paso 2: Subir a Netlify

**Opción A - Drag & Drop (más rápido):**
1. Ve a https://app.netlify.com/
2. **Login** con tu cuenta (o crea una gratis en 30 segundos)
3. Busca **"Deploys"** → **"Deploy new site"** → **"Upload an existing folder"**
4. Extrae el ZIP: `unzip dj-sarria-epk.zip`
5. **Arrastra la carpeta `dj-sarria/`** al área de Netlify
6. ¡Listo! En 30 segundos tendrás una URL como: `https://dj-sarria-epk-xxxxx.netlify.app`

**Opción B - Conectar a GitHub (más profesional):**
1. Push el código a un repo en GitHub
2. En Netlify: **"New site from Git"** → conecta tu repo
3. Netlify auto-deploya en cada push

---

## 📊 Lo que el DJ verá

✅ **Nombre, tagline y branding** (verde tribal)  
✅ **Biografía** en ES/EN/PT  
✅ **Shows próximos** (con fecha de Sint Maarten)  
✅ **Música** (2 sets de SoundCloud)  
✅ **Redes sociales** (Instagram, SoundCloud)  
✅ **Panel admin** (⚙️ en la navbar) con password `sarria2026`

⚠️ **Sin fotos todavía** (se subirán a Supabase después)  
⚠️ **Dominio temporal** (netlify.app, custom domain después)

---

## 🎯 Próximos pasos (después de mostrar al DJ)

1. **Resolver límite Supabase** (ver SETUP_SARRIA.md)
2. **Crear repo permanente** en GitHub
3. **Conectar a Supabase** para persistencia
4. **Subir fotos** a Storage
5. **Configurar dominio custom** (cuando lo compren)

---

## 📝 URL que compartirás con el DJ

Una vez en Netlify, tendrás algo como:
```
https://dj-sarria-epk-xxxxx.netlify.app
```

Cópiala y envíasela al DJ para que vea su EPK completo.

Admin: Click ⚙️ en la navbar, password: `sarria2026`

---

## ✨ Características del EPK

- **Responsive**: Se ve perfecto en móvil, tablet y desktop
- **Rápido**: 0 dependencias externas (HTML + CSS + JS puro)
- **Editable**: Panel admin para cambiar contenido al instante
- **Shareble**: Meta tags para preview en redes sociales
