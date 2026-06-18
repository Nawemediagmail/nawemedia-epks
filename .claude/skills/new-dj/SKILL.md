# new-dj

**Create a new DJ EPK in the monorepo with GitHub + Vercel data persistence.**

**PROACTIVE SKILL** — Used automatically when creating new DJs.

## Description

Automates the setup of a new DJ Electronic Press Kit (EPK) in the `djs/` folder with:
- Template HTML copied from clean generic template
- GitHub API integration for data persistence (epk-save, epk-load)
- Photo upload to GitHub via `/api/upload-photo`
- Admin panel with gallery, bio, stats, music, shows, socials management
- Ready for Vercel deployment

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

## Proactive Triggers

This skill is **used automatically** when you mention:

- "Tengo un nuevo DJ" / "I have a new DJ"
- "Agregar DJ [name]" / "Add DJ [name]"
- "Crear EPK para" / "Create EPK for"
- "Nuevo artista" / "New artist"
- "Onboard [name]"
- "Setup DJ [name]"

**What I'll do:** Extract DJ name and slug, then automatically run `/new-dj` without asking for the command.

## Architecture

Data is stored in GitHub (no Supabase):
- **EPK data** → `djs/{slug}/epk-data.json` (auto-updated via admin panel)
- **Photos** → `djs/{slug}/assets/` (uploaded via admin panel)
- **API routes** → `/api/epk-load`, `/api/epk-save`, `/api/upload-photo` (Vercel serverless functions)

## What it does

1. **Create folder structure**
   ```
   djs/[dj-slug]/
   ├── index.html      (from template/index.html)
   ├── epk-data.json   (initial empty data)
   ├── README.md       (setup checklist)
   └── assets/         (empty, ready for photos)
   ```

2. **Update configuration**
   - Set `const DJ_SLUG = "[dj-slug]"` in HTML (sed replacement)
   - Replace "ARTISTA" placeholder with DJ name in HTML

3. **Create initial data file**
   - `epk-data.json` with empty structure
   - Ready to be populated via admin panel

4. **Git commit**
   - Stages all new files
   - Commits with standard message

## After the Skill: Manual HTML Customization

The admin panel handles all data (bio, music, shows, gallery, socials, photos).
But some HTML content must be edited manually in `djs/[dj-slug]/index.html`:

- **Ticker** (top bar): lines ~945-952 — custom tour/event text
- **Hero location**: `CIUDAD · PAÍS`
- **Genre cards**: names and descriptions (~lines 1064-1087)
- **Bio meta**: City, Country, Active Since, Collective (~lines 1144-1147)
- **Contact email/WhatsApp**: in nav, hero, and footer
- **Footer text**: DJ name and genre description

## Files Generated

| File | Purpose |
|---|---|
| `djs/[dj-slug]/index.html` | Complete EPK (some HTML to customize) |
| `djs/[dj-slug]/epk-data.json` | Initial empty data |
| `djs/[dj-slug]/assets/` | Folder for photos |
| `djs/[dj-slug]/README.md` | Setup checklist |

## Time Estimate

- Skill execution: ~30 seconds
- Asset uploads (logo, hero, press photo): ~5 minutes
- Admin panel data entry: ~10 minutes
- Manual HTML customization: ~5 minutes
- **Total per DJ: ~20 minutes**

## Custom Domain

After creating the EPK, if the DJ has a custom domain, add to root `vercel.json`:

```json
{
  "source": "/assets/:path*",
  "destination": "/djs/[dj-slug]/assets/:path*",
  "has": [{"type": "host", "value": "theirdomain.com"}]
},
{
  "source": "/((?!api/).*)",
  "destination": "/djs/[dj-slug]/index.html",
  "has": [{"type": "host", "value": "theirdomain.com"}]
}
```

## Troubleshooting

**Problem:** Slug already exists  
**Solution:** Choose different slug or check existing folder

**Problem:** Admin panel won't save  
**Solution:** Check GITHUB_TOKEN in Vercel environment variables (Settings → Environment Variables)

**Problem:** Photos not uploading  
**Solution:** Check file size (max 2MB). Check browser console for errors.

**Problem:** Data not persisting after page reload  
**Solution:** Check `/api/epk-load` response in browser network tab. Verify `epk-data.json` exists in GitHub.

## Related Skills

- Apply to existing DJ: read their `index.html`, replace Supabase API calls with GitHub API calls, add `loadFromGitHub()`, `renderGalleryPublic()`, `updateStats()`, `updateHeroPhoto()` functions matching `djs/dj-bini/index.html`
