# Deploying FILINEX to Vercel (Full-Stack)

FILINEX is a **single-deploy full-stack** application on Vercel:

- **Frontend** (React SPA) → served as static files from `frontend/build/`
- **Admin panel** (`/admin` route) → same SPA, just a different React Router route — no extra setup needed
- **Backend** (FastAPI + AI Brief + Admin auth + Lead pipeline + Blog) → runs as a Python serverless function from `api/index.py`
- **Database** → MongoDB Atlas (free M0 tier works fine)

Everything you see locally — landing page, portfolio, blog, contact, proposal wizard, admin dashboard, JWT auth, lead CRUD — is deployed together by Vercel from this same repository.

---

## Step-by-step

### 1. Create a MongoDB Atlas cluster
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free **M0** cluster
- Add a database user (username + password)
- **Network Access** → "Allow access from anywhere" (0.0.0.0/0) so Vercel can connect
- Copy the connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

### 2. Push the repo to GitHub / GitLab / Bitbucket
```bash
cd /app
git init
git add .
git commit -m "FILINEX initial commit"
git branch -M main
git remote add origin https://github.com/<you>/filinex.git
git push -u origin main
```

### 3. Import into Vercel
- Sign in at https://vercel.com → **Add New Project**
- Pick your repo → click **Import**
- **Framework Preset**: leave as **Other** (vercel.json takes over)
- **Root Directory**: `./`
- Leave Build / Output settings on **auto** — `vercel.json` overrides them

### 4. Set Environment Variables in Vercel
Project → **Settings → Environment Variables** → add for **Production**, **Preview** and **Development**:

| Key | Example Value | Notes |
|---|---|---|
| `MONGO_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/...` | required |
| `DB_NAME` | `filinex_prod` | required |
| `JWT_SECRET` | a long random string (64+ chars) | required |
| `ADMIN_EMAIL` | `admin@filinex.com` | login email |
| `ADMIN_PASSWORD` | strong password | **change from default `password`** |
| `EMERGENT_LLM_KEY` | `sk-emergent-...` | needed only if you re-enable AI Brief |
| `CORS_ORIGINS` | `https://your-domain.com` | comma-separated, or `*` for testing |
| `REACT_APP_BACKEND_URL` | **leave EMPTY** | same-origin — see below |

> **Important about `REACT_APP_BACKEND_URL`**: On Vercel the frontend and API share the same domain, so this should be **empty** or unset. The frontend's `api.js` falls back to relative `/api/*` paths which Vercel routes to the serverless function automatically. **Do not** point it at the preview-emergent URL on Vercel — that's only for local dev.

### 5. Deploy
Hit **Deploy**. Vercel will:
1. Run `cd frontend && yarn install && yarn build` → outputs `frontend/build/`
2. Install `api/requirements.txt`
3. Wrap `api/index.py` (which imports `backend/server.py`) as a Python serverless function
4. Route every request:
   - `/api/*` → Python function (handles leads, admin auth, blog, brief)
   - everything else → `index.html` (React SPA, includes `/admin`, `/contact`, `/blog`, etc.)

### 6. After first deploy — verify
- Visit `https://your-app.vercel.app/` → home page loads
- Visit `https://your-app.vercel.app/admin` → admin login renders → log in with your env credentials → see dashboard
- Submit the Contact form → check the admin Leads list
- Hit `https://your-app.vercel.app/api/health` → returns `{"ok":true,...}`

### 7. Custom domain
Project → **Settings → Domains** → add `filinex.com` → set the DNS record Vercel shows you (A/CNAME).

---

## File layout (what makes Vercel work)

```
/
├── vercel.json              ← build + routing config (already in repo)
├── .vercelignore            ← excludes local artifacts
├── api/
│   ├── index.py             ← Vercel entry-point: imports FastAPI app
│   └── requirements.txt     ← Python deps for serverless
├── backend/
│   ├── server.py            ← FastAPI app (same code locally + on Vercel)
│   ├── .env                 ← LOCAL ONLY, ignored by Vercel
│   └── requirements.txt     ← full local deps
├── frontend/
│   ├── package.json
│   ├── .env                 ← LOCAL ONLY (REACT_APP_BACKEND_URL=preview URL)
│   └── src/                 ← React app (admin + public pages all here)
└── DEPLOY_VERCEL.md         ← this file
```

---

## Production hardening checklist

- [ ] `ADMIN_PASSWORD` rotated to a strong value (default is `password`)
- [ ] `JWT_SECRET` rotated to a fresh 64+ char random string
- [ ] `CORS_ORIGINS` restricted to your real domain(s)
- [ ] Vercel Analytics + Speed Insights enabled (free)
- [ ] MongoDB Atlas IP allowlist tightened to Vercel CIDRs (optional)
- [ ] Custom domain attached with HTTPS
- [ ] First lead submitted from production → confirmed in admin dashboard

---

## Common pitfalls

| Symptom | Fix |
|---|---|
| `502` on `/api/*` after deploy | Check Vercel function logs — usually a missing Python dep; ensure `api/requirements.txt` is committed |
| `MONGO_URL` missing error | Add it in Project → Settings → Environment Variables; redeploy |
| SPA route returns 404 (e.g. /admin direct load) | `vercel.json` already rewrites `/(.*) → /index.html`; if missing, restore from this repo |
| Cold start latency on first `/api` call | Expected on free tier — upgrade for warm functions, or accept the ~1.5s first-hit delay |
| CORS errors in browser | Confirm `CORS_ORIGINS` includes your Vercel/custom domain, or set to `*` temporarily |
| AI Brief returns "Budget exceeded" | Your Emergent LLM key balance is empty — top it up in Emergent profile, or unset `EMERGENT_LLM_KEY` |

---

## Local dev is unchanged

Your local supervisor setup keeps working exactly as before. Vercel deployment is purely additive — no breaking changes to the local workflow.
