// scripts/obfuscate.js — optional front-end obfuscation
import fs from 'fs';
import path from 'path';
import url from 'url';
import UglifyJS from 'uglify-js';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'app.js');
const minOut = path.join(root, 'public', 'app.min.js');
const obfOut = path.join(root, 'public', 'app.obf.js');

if (!fs.existsSync(src)) {
  console.error('public/app.js not found');
  process.exit(1);
}

const source = fs.readFileSync(src, 'utf8');
const minified = UglifyJS.minify(source);
if (minified.error) { console.error(minified.error); process.exit(1); }
fs.writeFileSync(minOut, minified.code, 'utf8');
console.log('Minified → public/app.min.js');

const obfuscated = JavaScriptObfuscator.obfuscate(source, {
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  stringArray: true,
  rotateStringArray: true,
  stringArrayThreshold: 0.75
});
fs.writeFileSync(obfOut, obfuscated.getCode(), 'utf8');
console.log('Obfuscated → public/app.obf.js');