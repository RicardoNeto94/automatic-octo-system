import { jsonResponse, requireApiKey, allowedOrigin, runtime } from "./_utils.js";
export { runtime } from "./_utils.js";

const menu = /** @type {Array} */ (JSON.parse(`[{"id": "ds001", "name": "Char Siu Pork", "price": 18.0, "allergens": ["GL", "SO"], "tags": ["signature", "pork"]}, {"id": "ds002", "name": "Steamed Shrimp Dumpling (Har Gow)", "price": 14.0, "allergens": ["GL", "CR"], "tags": ["dim-sum", "shrimp"]}, {"id": "ds003", "name": "Seasonal Greens with Garlic", "price": 9.5, "allergens": ["GA"], "tags": ["vegetarian"]}, {"id": "ds004", "name": "Silken Tofu with Black Sesame", "price": 8.0, "allergens": ["SE", "SO"], "tags": ["vegan"]}, {"id": "ds005", "name": "Crispy Duck Pancakes", "price": 21.0, "allergens": ["GL", "SO"], "tags": ["duck"]}]`));

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return jsonResponse({}, { status: 200 }, allowedOrigin(req));
  }
  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 }, allowedOrigin(req));
  }

  const gate = requireApiKey(req);
  if (!gate.ok) return jsonResponse(gate.body, { status: gate.status }, allowedOrigin(req));

  return jsonResponse({ menu }, { status: 200 }, allowedOrigin(req));
}