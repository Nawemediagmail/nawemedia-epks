# DJ SARRIA — EPK Setup Documentation

## Artist Info
- **Name**: SARRIA
- **Slug**: `dj-sarria`
- **Tagline**: La revelación del tribal
- **Location**: Medellín, Colombia
- **Contact**: mikee890130@gmail.com
- **WhatsApp**: +57 301 9306176
- **Genres**: Tribal, Circuit, House
- **Debut**: 2024
- **Shows**: 15+
- **Countries**: 3

## Branding
- **Primary Color**: #00a86b (Emerald Green)
- **Hover Color**: #008b45
- **Admin Password**: sarria2026

## Project Files
- `index.html` - Full app (HTML + CSS + JS + embedded EPK data)
- `vercel.json` - Vercel deployment config
- `epk-data.json` - EPK data reference (mirrors what's embedded in index.html)
- `assets/` - Photos and logos directory

## Setup Steps Remaining

### 1. Supabase Project
```bash
# Create project in supabase.com
# Org: agocbdvenolaqubwrtvf
# Region: us-east-2
# Name: dj-sarria-epk

# Run migrations (copy from NAWEMEDIA_EPK_SYSTEM.md section 8)
# Create tables: public.epk, public.epk_views
# Create Storage bucket: epk-assets

# Upload photos to: epk-assets/dj-sarria/photos/{filename}
# Upload logos to: epk-assets/dj-sarria/logos/{filename}

# Get:
# - Project ID
# - Publishable key (sb_publishable_...)
```

### 2. GitHub Repository
```bash
# Create: nawemediagmail/dj-sarria-epk (public, no init)
# Push this index.html to main
```

### 3. Vercel Deployment
```bash
# Create project in Vercel
# Team: team_AJK3ksf0robM6Pr8nJ3tSIrh
# Link to: nawemediagmail/dj-sarria-epk
# Add domain (will be determined)
```

### 4. Update index.html
After Supabase & Vercel are set up:
```javascript
// Replace placeholders in index.html:
// - {{PROJECT_ID}} → Supabase project ID
// - {{ANON_KEY}} → Supabase publishable key
// - {{DOMAIN}} → Custom domain (e.g., sarriadj.com)
```

### 5. DNS Configuration
Configure in Cloudflare:
- A record: `@` → `76.76.21.21` (DNS only)
- CNAME: `www` → `cname.vercel-dns.com` (DNS only)

## Photos Required
Download from Google Drive folder and rename:
- `PHOTO_HERO.jpeg` → `hero.jpg`
- `PHOTO_EDITORIAL V01.jpeg` → `editorial-1.jpg`
- `PHOTO_EDITORIAL V02.jpeg` → `editorial-2.jpg`
- `PHOTO_PRENSA V01.jpeg` → `prensa-1.jpg`
- `PHOTO_PRENSA V02.jpeg` → `prensa-2.jpg`
- `PHOTO_PRENSA V03.jpeg` → `prensa-3.jpg`
- `LOGO_COLOR.png` → `logo-color.png`
- `LOGO_NEGRO.png` → `logo-negro.png`

## SoundCloud Embeds
Music sets are already configured with correct color (#00a86b):
- RESURGENCE 2026
- BRUJERIA05 BY SARRIADJ

## Admin Panel
- Access: Click ⚙️ icon in navbar
- Password: `sarria2026`
- Can edit: artist info, bio, shows, gallery, music, presskit, social links
- Saves to: localStorage + Supabase

## Reference
See `NAWEMEDIA_EPK_SYSTEM.md` in parent directory for complete system documentation.
