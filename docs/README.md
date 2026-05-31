# Smarter Sipping — Static Site (`docs/`)

Plain HTML, CSS, and JavaScript version of the site. No build step.
Designed to be published directly from this folder on GitHub Pages.

## Files
- `index.html`, `learn.html`, `log.html`, `help.html`, `about.html`, `sources.html` — pages
- `styles.css` — shared styling (mirrors the React app's design tokens)
- `app.js` — shared client logic (rotating fact, drink log with `localStorage`)
- `assets/` — images
- `.nojekyll` — tells GitHub Pages **not** to run Jekyll, so files starting with `_` and folders served as-is

## Publishing on GitHub Pages

1. Push the repository to GitHub.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or your default) and folder **`/docs`**
4. Save. GitHub will publish the site at
   `https://<username>.github.io/<repo-name>/`.

The site is fully static, has no external API calls, and the only outbound
requests are to Google Fonts. It works offline once cached.

## Local preview

Any static server works, for example:

```bash
cd docs
python3 -m http.server 8080
# then open http://localhost:8080
```

## Notes
- The React/TanStack app under `src/` is unchanged. The `docs/` folder is a
  standalone mirror — you can host either or both.
- The drink log stores data only in the visitor's browser (`localStorage`).
