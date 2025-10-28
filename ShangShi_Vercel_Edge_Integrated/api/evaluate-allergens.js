import { jsonResponse, readJson, requireApiKey, allowedOrigin } from "./_utils.js";
export { runtime } from "./_utils.js";

const menu = /** @type {Array} */ (JSON.parse(`REPLACED_MENU_JSON`));

export default async function handler(req) {
  const origin = allowedOrigin(req);
  if (req.method === "OPTIONS") return jsonResponse({}, { status: 200 }, origin);
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, { status: 405 }, origin);

  const gate = requireApiKey(req);
  if (!gate.ok) return jsonResponse(gate.body, { status: gate.status }, origin);

  const payload = await readJson(req);
  if (!payload || !Array.isArray(payload.allergens)) {
    return jsonResponse({ error: "Invalid payload" }, { status: 400 }, origin);
  }

  const selected = new Set(payload.allergens.map(String));
  const safe = [];
  const flagged = [];

  for (const d of menu) {
    const hasConflict = (d.allergens || []).some(a => selected.has(a));
    (hasConflict ? flagged : safe).push(d);
  }
  return jsonResponse({ safe, flagged }, { status: 200 }, origin);
}