# NAWEMEDIA EPKs

Monorepo de Electronic Press Kits para DJs producidos por NAWEMEDIA.

## Estructura

```
nawemedia-epks/
├── djs/
│   └── {slug}/          ← un directorio por artista
│       ├── index.html   ← EPK completo (HTML + CSS + JS)
│       ├── vercel.json  ← config de deploy
│       └── assets/      ← logos y fotos locales
├── template/            ← plantilla base para nuevos EPKs
│   ├── index.html       ← con placeholders %%VARIABLE%%
│   └── vercel.json
├── NAWEMEDIA_EPK_SYSTEM.md   ← referencia técnica completa
└── NAWEMEDIA_EPK_INTAKE.md   ← formulario de intake + JSON template
```

## DJs activos

| Artista | Slug | Dominio | Vercel project |
|---|---|---|---|
| Ambar Lombardi | `ambar-lombardi` | ambarlombardi.com | dj-ambarlombardi-epk |

## Crear un nuevo EPK

1. Completar el formulario en `NAWEMEDIA_EPK_INTAKE.md` con el DJ
2. Copiar `template/` a `djs/{slug}/`
3. Reemplazar todos los `%%PLACEHOLDER%%` con los datos del artista
4. Crear proyecto en Supabase, Vercel y DNS según `NAWEMEDIA_EPK_SYSTEM.md`

O usar el skill `/dj-epk-new` en Claude Code para automatizar el setup.

## Referencia

- **Template repo**: github.com/Nawemediagmail/dj-epk-template
- **Sistema**: ver `NAWEMEDIA_EPK_SYSTEM.md`
- **Intake**: ver `NAWEMEDIA_EPK_INTAKE.md`
