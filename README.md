# Portfolio CV

A production-ready portfolio for a data analyst / data scientist. Built with React 18 + Vite, no backend, no database — all data lives in `src/data/projects.json`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Add or edit projects

**Option A — via the admin panel (recommended for quick edits):**

1. Go to `/admin`
2. Password: `domina2024` (change it in `src/pages/Admin.jsx`, line with `ADMIN_PASSWORD`)
3. Edit or create a project, click **Save project**
4. Click **Export JSON ↓** to download the updated `projects.json`
5. Replace `src/data/projects.json` with the downloaded file
6. Redeploy

**Option B — edit the file directly:**

Open `src/data/projects.json` and add an object to the `projects` array following the existing structure.

## Add project images

Place images in `/public/images/`, then reference them as `/images/filename.jpg` in the `imageUrl` field.

## Change the admin password

Open `src/pages/Admin.jsx` and update the value of `ADMIN_PASSWORD` near the top of the file.

## Deploy on Vercel

1. Push the repo to GitHub
2. Import it in vercel.com — Vercel auto-detects Vite
3. No environment variables needed

> **Note on persistence:** The admin panel writes to `localStorage` only. Changes made in the admin are visible immediately in the current browser session, but won't survive a redeployment unless you export the JSON and commit it to the repo.
