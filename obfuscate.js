// scripts/obfuscate.js
import fs from 'fs';
import path from 'path';
import url from 'url';
import UglifyJS from 'uglify-js';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcPath = path.join(root, 'public', 'app.js');
const minOut = path.join(root, 'public', 'app.min.js');
const obfOut = path.join(root, 'public', 'app.obf.js');

if (!fs.existsSync(srcPath)) {
  console.error('public/app.js not found.');
  process.exit(1);
}

const source = fs.readFileSync(srcPath, 'utf-8');

const minified = UglifyJS.minify(source);
if (minified.error) {
  console.error(minified.error);
  process.exit(1);
}
fs.writeFileSync(minOut, minified.code, 'utf-8');
console.log('Minified → public/app.min.js');

const obfuscated = JavaScriptObfuscator.obfuscate(source, {
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  stringArray: true,
  rotateStringArray: true,
  stringArrayThreshold: 0.75
});
fs.writeFileSync(obfOut, obfuscated.getCode(), 'utf-8');
console.log('Obfuscated → public/app.obf.js');

console.log('Remember to point index.html to app.obf.js for production if desired.');