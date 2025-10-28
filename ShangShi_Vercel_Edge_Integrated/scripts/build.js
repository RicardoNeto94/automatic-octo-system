// scripts/build.js — embed server/data/menu.json into Edge handlers
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const menuPath = path.join(root, 'server', 'data', 'menu.json');
const files = [path.join(root, 'api', 'menu.js'), path.join(root, 'api', 'evaluate-allergens.js')];

if (!fs.existsSync(menuPath)) {
  console.error('Missing server/data/menu.json');
  process.exit(1);
}
const menuJson = fs.readFileSync(menuPath, 'utf8');
const escaped = menuJson.replace(/`/g, '\\`');

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/JSON\.parse\(`REPLACED_MENU_JSON`\)/g, 'JSON.parse(`' + escaped + '`)');
  fs.writeFileSync(file, out, 'utf8');
  console.log('Embedded menu into', path.basename(file));
}
console.log('Done.');