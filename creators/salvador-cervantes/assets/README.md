# Fotos para Salvador Cervantes — Media Kit & Biolink

## Estructura de Archivos

Coloca las fotos profesionales en esta carpeta siguiendo esta estructura:

```
creators/salvador-cervantes/assets/
├── hero.jpg          ← Foto perfil (circular, 140x140px mínimo)
├── foto-1.jpg        ← Portfolio 1
├── foto-2.jpg        ← Portfolio 2
├── foto-3.jpg        ← Portfolio 3
├── editorial-1.jpg   ← Editorial (opcional)
├── editorial-2.jpg   ← Editorial (opcional)
└── press-1.jpg       ← Prensa (opcional)
```

## Requisitos de Fotos

### hero.jpg (OBLIGATORIO)
- **Uso:** Avatar en biolink + hero del Media Kit
- **Formato:** JPG, PNG, WebP
- **Tamaño mínimo:** 400x400px
- **Aspecto:** Cuadrado (1:1)
- **Contenido:** Foto de perfil profesional (portrait/headshot)
- **Compresión:** Optimizada para web (máx. 200KB)

### foto-1.jpg, foto-2.jpg, foto-3.jpg (OBLIGATORIOS para galería)
- **Uso:** Galería en biolink
- **Formato:** JPG, PNG, WebP
- **Tamaño mínimo:** 400x400px
- **Aspecto:** Cuadrado (1:1)
- **Contenido:** Fotos profesionales del portafolio
- **Compresión:** Optimizada (máx. 250KB cada una)

### editorial-*.jpg, press-*.jpg (OPCIONALES)
- **Uso:** Galería ampliada del Media Kit completo
- **Formato:** JPG, PNG, WebP
- **Tamaño recomendado:** 1200x800px mínimo
- **Aspecto:** Flexible (16:9, 4:3, cuadrado)
- **Compresión:** Optimizada para web

## Cómo Optimizar Fotos

### Usando ImageMagick (CLI)
```bash
# Reducir tamaño avatar
convert hero.jpg -resize 400x400 -quality 85 hero.jpg

# Reducir galería
convert foto-1.jpg -resize 400x400 -quality 80 foto-1.jpg
convert foto-2.jpg -resize 400x400 -quality 80 foto-2.jpg
convert foto-3.jpg -resize 400x400 -quality 80 foto-3.jpg
```

### Online (sin instalar nada)
- TinyPNG: https://tinypng.com/
- ImageOptim: https://imageoptim.com/
- Squoosh: https://squoosh.app/

## Verificación

Después de colocar las fotos, verifica en el navegador:

1. **biolink.html** → Avatar circular debe verse bien
2. **biolink.html** → Galería 3x1 debe mostrarse
3. **index.html** → Hero photo debe cargarse en sección hero
4. Inspecciona en DevTools (F12) que no haya errores 404

## Próximos Pasos

1. ✅ Colocar `hero.jpg` en assets/
2. ✅ Colocar `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg` en assets/
3. ⬜ Testing del biolink en navegador
4. ⬜ Deploy en servidor
5. ⬜ Envío de URL al cliente para revisión

## Notas

- Las fotos son la parte MÁS IMPORTANTE para conversión
- Cuanto mejor calidad, más profesional se ve
- Las imágenes deben ser optimizadas (no pesadas)
- Favicon/logo opcional en marca (puede agregarse después)
