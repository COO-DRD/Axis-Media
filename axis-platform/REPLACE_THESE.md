# AXIS UI Update — Drop-In Replacement

## What's in this zip

```
src/                  ← Replace your entire src/ folder with this
package.json          ← Replace your package.json (sharp & supabase-js removed)
astro.config.mjs      ← Same as before, included for reference
tailwind.config.mjs   ← Same as before, included for reference  
dist/                 ← Pre-built output — proof the build works clean
```

## What was fixed for Cloudflare Pages

| Problem | Fix |
|---------|-----|
| `sharp` in package.json | Removed — native Node module, breaks CF Pages build |
| `@supabase/supabase-js` in frontend deps | Removed — not needed in UI, was pulling in Node modules |
| All `<script>` tags | Already using `is:inline` + plain vanilla JS throughout |

## How to deploy

1. Unzip this file
2. In your GitHub repo (`axis-media-platform`):
   - Delete your existing `src/` folder
   - Drag in the new `src/` folder from this zip
   - Replace `package.json` with the one from this zip
3. Commit and push via GitHub Desktop
4. Cloudflare Pages auto-builds on push

**Cloudflare Pages settings** (should already be set):
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18 or 20 (set in CF Pages → Settings → Environment Variables → `NODE_VERSION = 20`)

## Backend (Railway) — unchanged
No changes to backend. Only the frontend src/ was updated.
