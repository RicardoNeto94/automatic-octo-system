# Shang Shi — Allergen Tool (Integrated, Vercel Edge)

This package contains your **current UI** under `/public` and adds protected **Edge API** routes under `/api`.
- Replace `server/data/menu.json` with your real menu.
- Run `npm run build` to embed it into the Edge handlers.
- Deploy with Vercel.

## Quick start
```bash
npm i -g vercel
vercel login
npm install
npm run build           # embed menu.json
vercel dev              # local test → http://localhost:3000/public/
vercel                  # deploy
```

## Optional hardening
- Add `API_KEY` in Vercel → Project Settings → Environment Variables.
- Put same key in requests header `X-API-Key`. You can also set it in your `public/app.js` if your front-end needs to pass it.
- Lock CORS: edit `api/_utils.js` → `allowedOrigin()` to your real domain(s).

## Endpoints
- `GET /api/menu`
- `POST /api/evaluate-allergens`  body: `{ "allergens": ["GL","MI"] }`