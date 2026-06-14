# NAWEMEDIA EPKs

Monorepo de Electronic Press Kits para DJs producidos por NAWEMEDIA.

**Stack:** Vercel + Supabase + GitHub (HTML/CSS/JS estático + persistencia vía Edge Functions)

## Estructura

```
nawemedia-epks/
├── djs/
│   ├── ambar-lombardi/
│   ├── yemix/
│   ├── dj-bini/
│   └── [dj-slug]/       ← nuevos DJs aquí
│       ├── index.html   ← EPK completo (HTML + CSS + JS + Admin Panel)
│       ├── vercel.json  ← config de routing por dominio
│       └── assets/      ← fotos y logos locales
├── template/            ← plantilla base actualizada (con Supabase)
│   ├── index.html       ← listo para copiar y adaptar
│   └── vercel.json
├── supabase/            ← Edge Functions para sync de datos
│   └── functions/
│       ├── epk-save/    ← POST para guardar datos
│       └── epk-load/    ← GET para cargar datos
├── scripts/
│   └── new-dj.sh        ← script para crear nuevo DJ
├── TEMPLATE_GUIDE.md    ← guía paso a paso (⭐ LEER PRIMERO)
├── NAWEMEDIA_EPK_SYSTEM.md
└── NAWEMEDIA_EPK_INTAKE.md
```

## DJs activos

| Artista | Slug | Dominio | Admin |
|---|---|---|---|
| Ambar Lombardi | `ambar-lombardi` | (en setup) | Ctrl+Alt+A |
| YEMIX | `yemix` | (en setup) | Ctrl+Alt+A |
| DJ BINI | `dj-bini` | djbini.com | Ctrl+Alt+A |

**Admin Panel Password:** `demo2026`

## Agregar un Nuevo DJ (Rápido)

### Opción 1: Script automático (recomendado)
```bash
./scripts/new-dj.sh dj-carlos "Carlos López"
# Luego editar djs/dj-carlos/index.html con datos
```

### Opción 2: Manual
```bash
mkdir -p djs/dj-nuevo/assets
cp template/index.html djs/dj-nuevo/
cp template/vercel.json djs/dj-nuevo/

# Editar:
# 1. const DJ_SLUG = "dj-nuevo"
# 2. defaultData con bio, music, shows, gallery, socials
# 3. Subir fotos a assets/
```

## Cómo Funciona (Arquitectura)

1. **Frontend:** HTML/CSS/JS estático en Vercel (1 proyecto compartido)
2. **Base de datos:** Tabla `epk` en Supabase con JSON por DJ
3. **Admin Panel:** Ctrl+Alt+A → edita localmente → guarda en Supabase
4. **Persistencia:** Edge Functions sincronizan entre dispositivos
5. **Hosting:** vercel.json enruta dominios a `/djs/[slug]/`

## Sincronización de Datos

- Admin edita → `saveData()` → POST `/functions/v1/epk-save`
- Load → GET `/functions/v1/epk-load?slug=dj-bini`
- Datos persisten en Supabase tabla `epk`
- Entre dispositivos: se cargan al abrir panel admin

## Documentación

- **⭐ [TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md)** ← Guía paso a paso
- [NAWEMEDIA_EPK_SYSTEM.md](NAWEMEDIA_EPK_SYSTEM.md) ← Sistema técnico completo
- [NAWEMEDIA_EPK_INTAKE.md](NAWEMEDIA_EPK_INTAKE.md) ← Formulario de intake

## Próximos Pasos (Plan 30 DJs)

- [ ] Template actualizado ✅
- [ ] Documentación ✅
- [ ] Script de automatización ✅
- [ ] Agregar 27 DJs (10 min c/u)
- [ ] Configurar DNS (Cloudflare)
- [ ] Mergear a main
