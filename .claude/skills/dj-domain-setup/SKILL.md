# dj-domain-setup

**Conecta un dominio personalizado (Cloudflare) a un DJ EPK en Vercel automáticamente.**

**PROACTIVE SKILL** — Se activa automáticamente en futuras conversaciones.

## Descripción

Automatiza todo el proceso de conectar un dominio personalizado (comprado en Cloudflare u otro registrador) a un EPK de DJ:

1. **Actualiza `vercel.json`** con rewrites para el dominio
2. **Guía la configuración DNS** en Cloudflare (CNAME records)
3. **Verifica en Vercel** que el dominio está conectado
4. **Valida** la configuración completa

Cero pasos manuales — todo desde la terminal.

## Uso

```
/dj-domain-setup [dominio] [dj-slug]
```

### Argumentos

- **dominio** (required): Dominio personalizado (ej: `www.djcarlos.com`, `djfay.com`)
- **dj-slug** (required): Slug del DJ (ej: `dj-carlos`, `dj-fay`)

### Ejemplos

```
/dj-domain-setup www.djcarlos.com dj-carlos
/dj-domain-setup djfay.com dj-fay
/dj-domain-setup www.yemix.cl yemix
```

## Proactive Triggers

Esta skill se activa automáticamente cuando mencionas:

- "Compré dominio `[dominio]` para `[DJ]`"
- "Conectar `[dominio]` a DJ `[slug]`"
- "Tengo dominio personalizado para `[DJ]`"
- "Cloudflare + `[DJ]` EPK"
- "`[dominio]` → `[DJ]`"
- "Setup dominio `[dominio]` para `[DJ]`"

**Qué hace:** Extrae dominio y DJ slug, luego ejecuta automáticamente `/dj-domain-setup` sin preguntar.

---

## Arquitectura

### Flujo de ejecución

```
1. VALIDAR
   ├─ Verifica que DJ slug existe en djs/[slug]/
   ├─ Valida formato del dominio
   └─ Detecta si es www o apex (faydj.com vs www.faydj.com)

2. ACTUALIZAR VERCEL.JSON
   ├─ Lee vercel.json actual
   ├─ Agrega 4 rewrites (2 para assets, 2 para index.html)
   │  ├─ /assets/:path* → /djs/[slug]/assets/:path*
   │  ├─ /((?!api/).*)  → /djs/[slug]/index.html
   │  ├─ Para dominio sin www
   │  └─ Para dominio con www
   ├─ Hace commit y push
   └─ Vercel auto-detecta

3. GUIAR CLOUDFLARE
   ├─ Muestra instrucciones paso a paso
   ├─ CNAME: [subdomain] → cname.vercel-dns.com
   ├─ Proxy: DNS only (nube gris)
   └─ Espera a que el usuario confirme

4. VERIFICAR VERCEL
   ├─ Obtiene info del proyecto en Vercel
   ├─ Busca el dominio en la lista de dominios
   ├─ Valida que está en "Valid Configuration"
   └─ Confirma que enruta a /djs/[slug]/

5. VALIDACIÓN FINAL
   ├─ Prueba DNS resolution
   ├─ Verifica que www y apex están cubiertos
   └─ Resumen: ✅ Dominio activo
```

### Estructura actualizada en vercel.json

```json
{
  "rewrites": [
    {
      "source": "/assets/:path*",
      "destination": "/djs/[dj-slug]/assets/:path*",
      "has": [{ "type": "host", "value": "[dominio-sin-www]" }]
    },
    {
      "source": "/assets/:path*",
      "destination": "/djs/[dj-slug]/assets/:path*",
      "has": [{ "type": "host", "value": "www.[dominio-sin-www]" }]
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/djs/[dj-slug]/index.html",
      "has": [{ "type": "host", "value": "[dominio-sin-www]" }]
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/djs/[dj-slug]/index.html",
      "has": [{ "type": "host", "value": "www.[dominio-sin-www]" }]
    }
  ]
}
```

---

## Pasos detallados (manual si falla automation)

### 1. Validación previa
```bash
# Verifica que DJ existe
ls djs/[dj-slug]/index.html

# Verifica formato dominio
# ✓ djfay.com
# ✓ www.djfay.com
# ✗ https://djfay.com (quitar https://)
```

### 2. Actualizar vercel.json
El skill lo hace automáticamente, pero manualmente sería:
- Agregar 4 rewrites para el dominio (2 sin www, 2 con www)
- Cada rewrite apunta a `/djs/[slug]/assets/` o `/djs/[slug]/index.html`
- Commit y push

### 3. Configurar DNS en Cloudflare
**Manual steps (la skill guía esto):**
- Login en Cloudflare → dashboard → selecciona dominio
- DNS → Records → Add CNAME
  - Name: `@` (para apex) o `www` (para www)
  - Content: `cname.vercel-dns.com`
  - TTL: Auto
  - Proxy: DNS only (nube gris)
- Repetir para ambos (apex + www) si ambos necesitan estar activos

### 4. Verificar en Vercel
- Dashboard → Proyecto → Settings → Domains
- Click "Add Existing"
- Escribe dominio
- Vercel valida automaticamente (si DNS está bien)
- Aparecerá "Valid Configuration" en segundos

### 5. Validar
```bash
# Resolver DNS
nslookup www.djfay.com
# Debería responder con IPs de Vercel

# Verificar que redirecciona correctamente
curl -I https://www.djfay.com
# HTTP 200 (o 308 redirect a www si apex)
```

---

## Casos especiales

### Dominio sin www (apex domain)

Si compró solo `djfay.com` (sin www):

```
Skill detecta: "djfay.com"
↓
Agrega 2 rewrites:
  - Para: djfay.com
  - Para: www.djfay.com (redirige a www)
↓
Cloudflare DNS:
  - @ → cname.vercel-dns.com  (apex)
  - www → cname.vercel-dns.com (www redirect)
↓
Resultado: 
  - djfay.com → redirige a www.djfay.com
  - www.djfay.com → EPK de DJ FAY
```

### Dominio con www

Si compró `www.djfay.com`:

```
Skill detecta: "www.djfay.com"
↓
Extrae base: "djfay.com"
↓
Agrega rewrites para ambos
↓
Cloudflare:
  - www → cname.vercel-dns.com
  - @ → cname.vercel-dns.com (opcional, para redirect)
```

### Migrar de otro registrador

Si el dominio no está en Cloudflare:
- Skill falla con error claro
- Guía: "Pasa el dominio a Cloudflare primero, luego ejecuta skill"
- O: edita vercel.json manualmente sin necesidad de DNS (si ya está apuntando a Vercel)

---

## Output esperado

```
[dj-domain-setup] Conectando www.djfay.com → dj-fay

✓ Validando...
  ├─ DJ slug: dj-fay ✓
  ├─ Dominio: www.djfay.com ✓
  └─ Base: djfay.com ✓

✓ Actualizando vercel.json...
  ├─ Agregando 4 rewrites ✓
  ├─ Commit: "chore: add www.djfay.com domain routing" ✓
  └─ Push a main ✓

📋 Próximo: Configurar DNS en Cloudflare

  1. Login: cloudflare.com → Dashboard
  2. Dominio: djfay.com
  3. DNS → Records → Add CNAME
     Name: www
     Content: cname.vercel-dns.com
     Proxy: DNS only (⊚ gray cloud)
  4. Repetir para @ (apex) si es necesario
  5. Esperar 5-15 minutos (propagación)

✓ Verificando Vercel...
  ├─ Proyecto: nawemedia-epks
  ├─ Dominio: www.djfay.com [pending DNS]
  └─ Enrutando a: /djs/dj-fay/index.html ✓

✅ LISTO
   Acceso en: https://www.djfay.com
   (después de que DNS se propague)
```

---

## Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| "DJ slug no existe" | Carpeta djs/[slug]/ no existe | Crear DJ primero con `/new-dj` |
| "Dominio inválido" | Formato de URL mal (ej: https://...) | Usa solo dominio: `djfay.com` o `www.djfay.com` |
| "Cloudflare records no encontrados" | Dominio no está en Cloudflare | Transfiere dominio a Cloudflare primero |
| Vercel no reconoce dominio | DNS no propagó o está mal configurado | Espera 15 min, verifica DNS con `nslookup` |
| "Valid Configuration" no aparece | CNAME apunta a otro lugar | Edita DNS: debe ser `cname.vercel-dns.com` exacto |
| Vercel muestra error 404 | vercel.json rewrites mal | Verifica que rewrite apunta a `/djs/[slug]/index.html` |
| DNS se ve bien pero no funciona | Proxy en Cloudflare está "Proxied" (naranja) | Cambia a "DNS only" (gris) |

---

## Automatización: Cuándo se activa

La skill se dispara automáticamente si escribes frases como:

```
"Acabo de comprar www.djcarlos.com para el DJ Carlos"
↓ Skill detecta automáticamente
↓ Extrae: dominio=www.djcarlos.com, dj=carlos
↓ Ejecuta: /dj-domain-setup www.djcarlos.com dj-carlos
```

```
"Quiero conectar djyemix.cl al EPK de YEMIX"
↓ Skill detecta
↓ /dj-domain-setup djyemix.cl yemix
```

---

## Checklist post-setup

- [ ] vercel.json actualizado con 4 rewrites
- [ ] DNS CNAME en Cloudflare apunta a `cname.vercel-dns.com`
- [ ] Proxy en Cloudflare está en "DNS only" (⊚ gris)
- [ ] Vercel muestra "Valid Configuration" para el dominio
- [ ] Dominio resuelve a IPs de Vercel (`nslookup`)
- [ ] `https://[dominio]` abre EPK de DJ
- [ ] Assets (fotos) cargan correctamente
- [ ] Admin panel accesible en `/djs/[slug]/#admin`

---

## Related Skills

- `/new-dj` — crear estructura de nuevo DJ (ejecutar primero)
- `/epk-admin` — documentación del panel admin
- `/dj-fay` — ejemplo completo de DJ con dominio personalizado (www.faydj.com)
