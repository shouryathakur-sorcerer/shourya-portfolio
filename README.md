# Shourya Thakur — Portfolio

A dark, navy-themed React portfolio with a built-in Admin Console.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Admin Console

Access the admin panel at: `http://localhost:5173/?admin`  
Or click the **⚙ Admin** button (bottom-right of the live site).

**Default password:** `admin123`  
→ Change it in `src/AdminConsole.jsx` line 3: `const ADMIN_PASSWORD = "admin123";`

### What you can edit:
- **Meta** — Name, role, hero text, social links, email
- **About** — Bio paragraphs, focus area cards
- **Skills** — Add/remove skills, adjust proficiency sliders
- **Projects** — Add/edit/remove project cards + tags
- **Research** — Papers with year, abstract, optional link
- **Contact** — Section heading and subheading

Changes are saved to **localStorage** and reflect instantly on the site.

---

## Deploying to Netlify

### Option A — Netlify CLI (recommended)
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Option B — Netlify Dashboard
1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

---

## Making Edits Permanent

Admin changes live in `localStorage` — they persist in your browser but won't survive a fresh deploy.

To permanently bake edits into the build:
1. Open the Admin Console
2. Scroll to the bottom and click **⬇ Export data.js for Netlify deploy**
3. Replace `src/data.js` with the downloaded file
4. Commit & push → Netlify auto-deploys

---

## File Structure

```
src/
├── main.jsx          # React entry point
├── App.jsx           # Router (portfolio ↔ admin)
├── data.js           # Single source of truth for all content
├── Portfolio.jsx     # Public-facing website
└── AdminConsole.jsx  # Password-protected editor
index.html
vite.config.js
netlify.toml          # SPA redirect rules
```
