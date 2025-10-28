// api/_utils.js
export const runtime = 'edge';

/**
 * Basic CORS for public front-ends. Lock down origins in production.
 */
export function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    "Vary": "Origin"
  };
}

/**
 * Gate API by optional API key.
 * If process.env.API_KEY is set, require header X-API-Key to match.
 * If not set, allow open access (development).
 */
export function requireApiKey(req) {
  const required = process.env.API_KEY;
  if (!required) return { ok: true };
  const provided = req.headers.get("x-api-key");
  if (provided && provided === required) return { ok: true };
  return { ok: false, status: 401, body: { error: "Unauthorized" } };
}

/**
 * Read JSON body safely.
 */
export async function readJson(req) {
  try {
    return await req.json();
  } catch (e) {
    return null;
  }
}

/**
 * Build a JSON Response with CORS.
 */
export function jsonResponse(data, init = {}, origin = "*") {
  const headers = { "Content-Type": "application/json", ...corsHeaders(origin), ...(init.headers || {}) };
  return new Response(JSON.stringify(data), { ...init, headers });
}

/**
 * Simple referer/origin allow-list (tighten in production).
 */
export function allowedOrigin(req) {
  const origin = req.headers.get("origin") || "*";
  // TODO: replace with your deployed domain(s)
  const allowList = ["http://localhost:3000", "http://127.0.0.1:3000", origin];
  return allowList.includes(origin) ? origin : "*";
}