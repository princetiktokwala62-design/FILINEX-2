# Deploying FILINEX to Vercel

FILINEX is built as **React (frontend) + FastAPI (Python serverless API) + MongoDB Atlas** for fully Vercel-native deployment.

## One-time setup

### 1. Create a MongoDB Atlas cluster
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free **M0** cluster
- Add a database user (username + password)
- Network Access → "Allow access from anywhere" (0.0.0.0/0) for Vercel serverless egress
- Copy the connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

### 2. Push the repo to GitHub
```bash
cd /app
git init && git add . && git commit -m "FILINEX initial commit"
git remote add origin https://github.com/<you>/filinex.git
git push -u origin main
```

### 3. Connect to Vercel
- Sign in at https://vercel.com → **Add New Project** → import your GitHub repo
- Framework Preset: **Other** (vercel.json handles the rest)
- Root Directory: `./`
- Leave Build / Output settings on **auto** (vercel.json overrides)

### 4. Set Environment Variables in the Vercel dashboard
Project → **Settings → Environment Variables** → add for **Production**, **Preview** and **Development**:

| Key | Value | Notes |
|---|---|---|
| `MONGO_URL` | Your Atlas connection string | required |
| `DB_NAME` | `filinex_prod` (or any name) | required |
| `JWT_SECRET` | random 64-char string | required |
| `ADMIN_EMAIL` | `admin@filinex.com` | login email |
| `ADMIN_PASSWORD` | `password` | change for prod! |
| `EMERGENT_LLM_KEY` | `sk-emergent-...` | required for AI Brief |
| `CORS_ORIGINS` | `https://your-domain.com` | comma-separated |
| `REACT_APP_BACKEND_URL` | (leave blank or `/`) | same-origin on Vercel |

> **Important**: On Vercel the frontend is served from the same domain as the API, so `REACT_APP_BACKEND_URL` should be set to **an empty string** or your custom domain (e.g. `https://filinex.com`). The frontend prefixes all calls with `/api`, which Vercel routes to `/api/index.py`.

### 5. Deploy
Hit **Deploy**. Vercel will:
- Run `cd frontend && yarn install && yarn build` → outputs `frontend/build/`
- Install `api/requirements.txt` and expose `api/index.py` as a Python serverless function
- Route `/api/*` to the Python function and everything else to the React SPA

## File layout for Vercel

```
/
├── vercel.json              ← build + routing config
├── api/
│   ├── index.py             ← imports FastAPI app from backend/server.py
│   └── requirements.txt     ← Python deps for the serverless function
├── backend/
│   └── server.py            ← FastAPI app (works locally and on Vercel)
├── frontend/
│   ├── package.json
│   ├── .env                 ← REACT_APP_BACKEND_URL (local only)
│   └── src/…
└── .vercelignore
```

## Custom domain
Project → **Settings → Domains** → add `filinex.com` → set DNS A/CNAME per Vercel's instructions.

## After first deploy — production hardening
- Change `ADMIN_PASSWORD` to a strong value (rotate `JWT_SECRET` too)
- Restrict `CORS_ORIGINS` to your actual domain(s)
- Enable Vercel Analytics + Speed Insights from the dashboard
- Set up MongoDB Atlas IP allowlist to Vercel's CIDR ranges if you need stricter access
- Rotate the Emergent LLM key from your Emergent profile if exposed

## Local development
Unchanged — `sudo supervisorctl restart backend/frontend` and visit the preview URL.

## Common pitfalls
- **502 on /api/* in Vercel**: usually a Python dependency error; check function logs in the Vercel dashboard
- **`MONGO_URL` missing**: add it to Vercel env vars and redeploy
- **SPA routes return 404**: confirm `vercel.json` rewrites `/(.*) -> /index.html`
- **Cold start latency on first /api call**: expected on the free tier — upgrade for warm functions
