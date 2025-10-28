import { jsonResponse, requireApiKey, allowedOrigin } from "./_utils.js";
export { runtime } from "./_utils.js";

const menu = /** @type {Array} */ (JSON.parse(`REPLACED_MENU_JSON`));

export default async function handler(req) {
  const origin = allowedOrigin(req);
  if (req.method === "OPTIONS") return jsonResponse({}, { status: 200 }, origin);
  if (req.method !== "GET") return jsonResponse({ error: "Method not allowed" }, { status: 405 }, origin);

  const gate = requireApiKey(req);
  if (!gate.ok) return jsonResponse(gate.body, { status: gate.status }, origin);

  return jsonResponse({ menu }, { status: 200 }, origin);
}