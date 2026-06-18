#!/bin/bash
# new-dj skill: Create a new DJ EPK

set -e

if [ -z "$1" ]; then
  echo "Usage: new-dj.sh <dj-slug> [dj-name]"
  echo "Example: new-dj.sh dj-carlos 'Carlos López'"
  exit 1
fi

DJ_SLUG=$1
DJ_NAME=${2:-${DJ_SLUG}}

echo ""
echo "Creating EPK for: $DJ_NAME ($DJ_SLUG)"
echo ""

if [ -d "djs/$DJ_SLUG" ]; then
  echo "Error: djs/$DJ_SLUG already exists"
  exit 1
fi

mkdir -p "djs/$DJ_SLUG/assets"

cp template/index.html "djs/$DJ_SLUG/index.html"

# Replace DJ_SLUG_PLACEHOLDER with actual slug
sed -i "s/DJ_SLUG_PLACEHOLDER/$DJ_SLUG/g" "djs/$DJ_SLUG/index.html"

# Replace ARTISTA with DJ name (if provided and different from slug)
if [ "$DJ_NAME" != "$DJ_SLUG" ]; then
  sed -i "s/ARTISTA/$DJ_NAME/g" "djs/$DJ_SLUG/index.html"
fi

# Create initial empty epk-data.json
cat > "djs/$DJ_SLUG/epk-data.json" << EOF
{
  "bio": {
    "en": "",
    "es": "",
    "de": ""
  },
  "music": [],
  "video": {
    "url": "",
    "title": ""
  },
  "shows": [],
  "gallery": [],
  "socials": [],
  "stats": {
    "toques": "0",
    "paises": "0",
    "activo_desde": "2024"
  },
  "hero_photo": "assets/hero.jpg"
}
EOF

cat > "djs/$DJ_SLUG/README.md" << EOF
# $DJ_NAME EPK

**Admin Password:** \`demo2026\`

## Setup Checklist

- [ ] Upload logo to \`assets/logo.png\`
- [ ] Upload hero photo to \`assets/hero.jpg\`
- [ ] Upload press photo to \`assets/prensa.jpg\`
- [ ] Open admin panel (Ctrl+Alt+A) and update:
  - Bio (EN, ES, DE)
  - Music tracks (SoundCloud embed URLs)
  - Shows
  - Gallery photos
  - Social links
- [ ] Update hardcoded HTML content (ticker, genres, location, footer)
- [ ] Add domain to root \`vercel.json\` if using custom domain
- [ ] Push to main

## Admin Panel

1. Open EPK in browser
2. Press **Ctrl+Alt+A**
3. Enter password: \`demo2026\`
4. Edit all sections and save

## Data Storage

All data saved via admin panel is stored in:
- \`djs/$DJ_SLUG/epk-data.json\` — EPK data (auto-committed to GitHub)
- \`djs/$DJ_SLUG/assets/\` — Uploaded photos (auto-committed to GitHub)

## Custom Domain

Add to root \`vercel.json\`:
\`\`\`json
{
  "source": "/assets/:path*",
  "destination": "/djs/$DJ_SLUG/assets/:path*",
  "has": [{"type": "host", "value": "yourdomain.com"}]
},
{
  "source": "/((?!api/).*)",
  "destination": "/djs/$DJ_SLUG/index.html",
  "has": [{"type": "host", "value": "yourdomain.com"}]
}
\`\`\`
EOF

git add "djs/$DJ_SLUG/"
git commit -m "feat: add $DJ_NAME EPK scaffold

- GitHub + Vercel data persistence (no Supabase)
- Admin panel with photo upload support
- Ready to customize via admin panel"

echo ""
echo "Done! Created djs/$DJ_SLUG/"
echo ""
echo "Next steps:"
echo "  1. Add assets: logo.png, hero.jpg, prensa.jpg to djs/$DJ_SLUG/assets/"
echo "  2. Open EPK -> Ctrl+Alt+A -> password: demo2026"
echo "  3. Fill in bio, music, shows, gallery, socials"
echo "  4. Update hardcoded HTML: ticker, genres, location text"
echo "  5. Push: git push origin main"
echo ""
