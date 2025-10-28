export const runtime = 'edge';

export function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    "Vary": "Origin"
  };
}

export function allowedOrigin(req) {
  const origin = req.headers.get("origin") || "*";
  // TODO: tighten this list to your real domain(s) after first deploy
  const allowList = [origin, "http://localhost:3000", "http://127.0.0.1:3000"];
  return allowList.includes(origin) ? origin : "*";
}

export function requireApiKey(req) {
  const required = process.env.API_KEY;
  if (!required) return { ok: true };
  const provided = req.headers.get("x-api-key");
  if (provided && provided === required) return { ok: true };
  return { ok: false, status: 401, body: { error: "Unauthorized" } };
}

export async function readJson(req) {
  try { return await req.json(); } catch { return null; }
}

export function jsonResponse(data, init = {}, origin = "*") {
  const headers = { "Content-Type": "application/json", ...corsHeaders(origin), ...(init.headers || {}) };
  return new Response(JSON.stringify(data), { ...init, headers });
}