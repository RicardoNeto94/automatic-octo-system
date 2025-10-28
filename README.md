# Shang Shi Allergen Tool — Protected (Vercel Edge)

This project converts your front-end-only allergen tool into a **server-backed** product using **Vercel Edge Functions**. Core logic and data now live server-side, which makes copying far more difficult.

## What you get
- **/api/menu** — returns menu data (from server-side JSON; not shipped to the client)
- **/api/evaluate-allergens** — evaluates "safe vs flagged" dishes for a set of allergens
- Updated **front-end** (`public/`) that calls these APIs
- Optional **API key** gating via `X-API-Key` header
- Build step to **minify + obfuscate** front-end JS for production

---

## Quick start

1. **Install Vercel CLI** and log in
```bash
npm i -g vercel
vercel login
```

2. **Install dependencies**
```bash
npm install
```

3. **Run locally**
```bash
vercel dev
# Visit http://localhost:3000/public/
```

> Edge Functions will be available under `/api/*` while running `vercel dev`.

---

## Deploy

```bash
vercel
# follow prompts
```

Once deployed, your app will be accessible at the Vercel URL. The front-end assumes **same-origin** API calls — so hosting public files on the same Vercel project is ideal.

---

## Configure API Key (optional but recommended)

Set `API_KEY` in your Vercel project settings (Environment Variables). When set, all API calls must include header:
```
X-API-Key: <your-key>
```

In `public/app.js`, you can set:
```js
const API_KEY = '<your-key>';
```

---

## Replace server-side menu data

Edit `server/data/menu.json` and **embed** it into the Edge functions before deploy. Since Edge runtime cannot use filesystem APIs, we embed the JSON at build time using `scripts/build.js`.

1) Update `server/data/menu.json` with your real dishes and allergen codes.
2) Run:
```bash
npm run build
```
This command will generate `api/menu.js` and `api/evaluate-allergens.js` with your **embedded** menu data string.

> During dev, the current files already embed a small sample menu.

---

## Obfuscate/minify front-end (production)

Run:
```bash
npm run obfuscate
```
This script will generate an obfuscated `public/app.obf.js` and also minify the standard `public/app.js`. Update your `public/index.html` to reference the obfuscated file for production if desired.

> Obfuscation slows down reverse-engineering. It does not make it impossible. The **real** protection is that your logic and data are on the server.

---

## Locking down origins (CORS)

In `api/_utils.js`, tighten `allowedOrigin()` to allow only your production domain(s), e.g.
```js
const allowList = ["https://allergen.yourdomain.com"];
```

---

## Structure
```
.
├── api
│   ├── _utils.js
│   ├── evaluate-allergens.js
│   └── menu.js
├── public
│   ├── app.js
│   ├── assets
│   │   └── logo.png
│   └── styles.css
├── server
│   └── data
│       └── menu.json
├── scripts
│   ├── build.js
│   └── obfuscate.js
├── package.json
├── vercel.json
└── README.md
```

---

## Notes
- **Edge runtime** cannot read from filesystem — we embed the menu JSON during build.
- Consider moving menu data to **KV/D1/Database** for dynamic updates without redeploy.
- Add **logging & rate limiting** using Vercel Middleware or a hosted KV counter if scraping becomes an issue.
- Keep **NDA/IP assignment** in place with anyone who touches the code or data.