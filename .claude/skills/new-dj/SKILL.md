# new-dj

**Create a new DJ EPK in the monorepo with Supabase integration.**

## Description

Automates the setup of a new DJ Electronic Press Kit (EPK) in the `djs/` folder with:
- Template HTML + admin panel
- Supabase Edge Functions integration (epk-save, epk-load)
- Data persistence across devices
- Vercel deployment ready
- Git commit

## Usage

```
/new-dj [dj-slug] [dj-name]
```

### Arguments

- **dj-slug** (required): URL-friendly identifier (e.g., `dj-carlos`, `nombre-apellido`)
- **dj-name** (optional): Full DJ name for display (e.g., "Carlos López")

### Examples

```
/new-dj dj-carlos "Carlos López"
/new-dj yara-yara Yara
/new-dj dj-tech
```

## What it does

1. **Create folder structure**
   ```
   djs/[dj-slug]/
   ├── index.html      (from template)
   ├── vercel.json
   └── assets/         (empty, ready for photos)
   ```

2. **Update configuration**
   - Set `const DJ_SLUG = "[dj-slug]"` in HTML
   - Prepare `defaultData` with placeholders

3. **Prepare Supabase entry**
   - Generate SQL INSERT for table `epk`
   - Ready to copy/paste into Supabase

4. **Create seed documentation**
   - Generate `djs/[dj-slug]/README.md` with:
     - Admin credentials
     - Next steps checklist
     - SoundCloud embed instructions
     - Photo naming convention

5. **Git commit**
   - Stage all files
   - Commit with standard message
   - Ready to push

## Next Steps After Skill

The DJ will still need:

1. **Add bio & data** (5 min)
   - Edit `defaultData` in `djs/[dj-slug]/index.html`
   - EN, ES, DE versions
   - SoundCloud embed URLs

2. **Upload photos** (3 min)
   - Place in `djs/[dj-slug]/assets/`
   - Update gallery URLs

3. **Test admin panel** (2 min)
   - Ctrl+Alt+A to open (password: `demo2026`)
   - Test save/sync with Supabase

4. **Deploy**
   - Push to main or feature branch
   - Vercel auto-deploys

## Skill Implementation

This skill will:

```bash
#!/bin/bash

DJ_SLUG=$1
DJ_NAME=${2:-${DJ_SLUG}}

# 1. Create directory structure
mkdir -p djs/$DJ_SLUG/assets

# 2. Copy template
cp template/index.html djs/$DJ_SLUG/
cp template/vercel.json djs/$DJ_SLUG/

# 3. Update DJ_SLUG in HTML
sed -i "s/const DJ_SLUG = \"dj-bini\"/const DJ_SLUG = \"$DJ_SLUG\"/" djs/$DJ_SLUG/index.html

# 4. Create README with next steps
cat > djs/$DJ_SLUG/README.md << 'EOF'
# [DJ_NAME] EPK

Admin Password: `demo2026`

## Next Steps

- [ ] Edit bio (EN, ES, DE) in index.html
- [ ] Add SoundCloud tracks
- [ ] Add upcoming shows
- [ ] Upload photos to assets/
- [ ] Update artist info (name, contact, genres)
- [ ] Test admin panel (Ctrl+Alt+A)
- [ ] Push to main

## Files

- `index.html` - Complete EPK (edit defaultData)
- `vercel.json` - Domain routing
- `assets/` - Photos and media

## Admin Panel

1. Open EPK
2. Press Ctrl+Alt+A
3. Enter password: `demo2026`
4. Edit tabs: Bio, Music, Shows, Gallery, Socials
5. Changes auto-save to Supabase
EOF

# 5. Generate Supabase SQL (for manual insert if needed)
cat > djs/$DJ_SLUG/supabase-seed.sql << 'EOF'
INSERT INTO epk (slug, data) VALUES (
  '[DJ_SLUG]',
  '{
    "bio": {"en": "", "es": "", "de": ""},
    "music": [],
    "shows": [],
    "gallery": [],
    "socials": [],
    "artist": {"name": "[DJ_NAME]"}
  }'::jsonb
);
EOF

# 6. Git commit
git add djs/$DJ_SLUG/
git commit -m "feat: add $DJ_NAME EPK to monorepo

- Created DJ profile with admin panel
- Connected to Supabase for persistent data sync
- Ready to customize bio, music, shows, and gallery"
```

## Files Generated

| File | Purpose |
|---|---|
| `djs/[dj-slug]/index.html` | Complete EPK (edit to customize) |
| `djs/[dj-slug]/vercel.json` | Domain routing config |
| `djs/[dj-slug]/assets/` | Folder for photos (empty) |
| `djs/[dj-slug]/README.md` | Setup checklist and next steps |
| `djs/[dj-slug]/supabase-seed.sql` | SQL INSERT (optional manual setup) |

## Time Estimate

- Skill execution: 30 seconds
- Manual data entry: 10-15 minutes
- Photos upload: 5 minutes
- **Total per DJ: ~15-20 minutes**

## Status Check

After running skill:
```bash
# Verify structure
ls -la djs/[dj-slug]/

# Preview HTML
grep "const DJ_SLUG" djs/[dj-slug]/index.html

# Check git staging
git status
```

## Troubleshooting

**Problem:** Slug already exists  
**Solution:** Choose different slug (e.g., `dj-carlos-2`, `carlos-lopez-chile`)

**Problem:** SoundCloud embeds not showing  
**Solution:** Ensure URL is SoundCloud embed format: `https://w.soundcloud.com/player/?url=...`

**Problem:** Photos not displaying  
**Solution:** Check file path in `gallery[].src` — should be relative: `assets/photo.jpg`

## Related Skills

- `/dj-photos-upload` - Optimize and upload photos for DJ
- `/dj-admin-test` - Test admin panel connectivity
- `/dj-supabase-migrate` - Migrate legacy DJ to Supabase model
