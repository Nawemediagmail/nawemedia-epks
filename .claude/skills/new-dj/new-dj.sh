#!/bin/bash
# new-dj skill: Create a new DJ EPK in the monorepo

set -e

if [ -z "$1" ]; then
  echo "Usage: new-dj.sh <dj-slug> [dj-name]"
  echo "Example: new-dj.sh dj-carlos 'Carlos López'"
  exit 1
fi

DJ_SLUG=$1
DJ_NAME=${2:-${DJ_SLUG}}

echo ""
echo "🎵 Creating EPK for: $DJ_NAME ($DJ_SLUG)"
echo ""

# Check if slug already exists
if [ -d "djs/$DJ_SLUG" ]; then
  echo "❌ Error: djs/$DJ_SLUG already exists"
  exit 1
fi

# 1. Create directory structure
echo "📁 Creating directory structure..."
mkdir -p "djs/$DJ_SLUG/assets"

# 2. Copy template files
echo "📋 Copying template files..."
cp template/index.html "djs/$DJ_SLUG/"
cp template/vercel.json "djs/$DJ_SLUG/"

# 3. Update DJ_SLUG in HTML
echo "⚙️  Configuring DJ slug..."
sed -i "s/const DJ_SLUG = \"dj-bini\"/const DJ_SLUG = \"$DJ_SLUG\"/" "djs/$DJ_SLUG/index.html"

# 4. Create README with next steps
echo "📝 Creating setup guide..."
cat > "djs/$DJ_SLUG/README.md" << EOF
# $DJ_NAME EPK

**Admin Password:** \`demo2026\`

## Setup Checklist

- [ ] **Edit bio** (EN, ES, DE) in \`index.html\` line ~1517
- [ ] **Add SoundCloud tracks** (update music array with embed URLs)
- [ ] **Add upcoming shows** (date, venue, city, country)
- [ ] **Upload photos** to \`assets/\` folder
- [ ] **Update artist info** (name, contact, genres, location)
- [ ] **Configure socials** (Instagram, SoundCloud, etc.)
- [ ] **Test admin panel** (Ctrl+Alt+A, password: \`demo2026\`)
- [ ] **Verify Supabase sync** (open admin, make change, check saves)

## Quick Links

- **Admin Panel:** Ctrl+Alt+A (or ⚙ button in nav)
- **defaultData:** Line ~1516 in index.html
- **SoundCloud Embeds:** Get from player "Share" → "Embed"

## Files

- \`index.html\` - Complete EPK (edit \`defaultData\`)
- \`vercel.json\` - Domain routing config
- \`assets/\` - Place photos here (update URLs in index.html)
- \`supabase-seed.sql\` - Backup: manual DB insert if needed

## Data Structure

The \`defaultData\` object contains:

\`\`\`javascript
{
  "bio": {
    "en": "English bio here",
    "es": "Bio en español aquí",
    "de": "Deutsche Bio hier"
  },
  "music": [
    {
      "id": 1,
      "title": "Track Name",
      "type": "set",
      "url": "https://w.soundcloud.com/player/..."
    }
  ],
  "shows": [
    {
      "id": 1,
      "date": "2026-07-18",
      "venue": "Club Name",
      "city": "City",
      "country": "Country",
      "type": "club",
      "url": "#"
    }
  ],
  "gallery": [
    {"id": 1, "src": "assets/photo.jpg", "cap": "Caption"}
  ],
  "socials": [
    {"id": 1, "plat": "Instagram", "handle": "@handle", "url": "https://..."}
  ],
  "artist": {
    "name": "$DJ_NAME",
    "tagline": "Your tagline",
    "location": "City · Country",
    "genres": ["Genre1", "Genre2"],
    "contact": "email@example.com",
    "whatsapp": "+1234567890"
  }
}
\`\`\`

## Troubleshooting

**Problem:** Admin panel won't save
**Solution:** Check browser console (F12). Ensure Supabase Edge Functions are ACTIVE.

**Problem:** Photos not showing
**Solution:** Verify file names in gallery array. Use relative paths: \`assets/filename.jpg\`

**Problem:** SoundCloud embed looks broken
**Solution:** Copy full embed URL from SoundCloud player. Format should be: \`https://w.soundcloud.com/player/?url=...\`

## Next: Testing

1. Open EPK in browser
2. Press Ctrl+Alt+A
3. Enter password: \`demo2026\`
4. Edit a field (e.g., bio)
5. Click Save
6. Open DevTools (F12) → Console
7. Should see "✅ Guardado!" (saved) message

## Finally: Deploy

\`\`\`bash
git push origin main
\`\`\`

Vercel will auto-deploy. Check status at:
https://vercel.com/nawemedia-8661s-projects/nawemedia-epks
EOF

# 5. Generate Supabase SQL (for reference)
echo "💾 Generating Supabase SQL template..."
cat > "djs/$DJ_SLUG/supabase-seed.sql" << EOF
-- Insert DJ data into Supabase epk table
-- Copy/paste this into Supabase SQL editor if needed
INSERT INTO epk (slug, data) VALUES (
  '$DJ_SLUG',
  '{
    "bio": {
      "en": "",
      "es": "",
      "de": ""
    },
    "music": [],
    "shows": [],
    "gallery": [],
    "socials": [],
    "video": {
      "url": "",
      "title": ""
    },
    "artist": {
      "name": "$DJ_NAME",
      "tagline": "",
      "location": "",
      "genres": [],
      "contact": "",
      "whatsapp": ""
    }
  }'::jsonb
) ON CONFLICT (slug) DO NOTHING;
EOF

# 6. Git add and commit
echo "🔗 Creating git commit..."
git add "djs/$DJ_SLUG/"
git commit -m "feat: add $DJ_NAME EPK to monorepo

- Created DJ profile with admin panel
- Connected to Supabase for persistent data sync
- Template includes EN/ES/DE language support
- Ready to customize with bio, music, shows, and gallery"

echo ""
echo "✅ Success! Created djs/$DJ_SLUG/"
echo ""
echo "📋 Next steps:"
echo "   1. Edit djs/$DJ_SLUG/index.html"
echo "      - Update defaultData with bio, music, shows, photos, socials"
echo "      - Lines ~1516-1550"
echo ""
echo "   2. Upload photos to djs/$DJ_SLUG/assets/"
echo ""
echo "   3. Test admin panel:"
echo "      - Open EPK in browser"
echo "      - Ctrl+Alt+A → password: demo2026"
echo "      - Make a change and Save"
echo ""
echo "   4. Push to main:"
echo "      - git push origin main"
echo "      - Vercel auto-deploys"
echo ""
echo "⏱️  Estimated time to finish: 10-15 minutes"
echo ""
