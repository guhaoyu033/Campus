import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);

const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (cssFile) {
  const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  html = html.replace(
    new RegExp(`<link rel="stylesheet"[^>]*${cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`, 'g'),
    `<style>${css}</style>`
  );
}

if (jsFile) {
  const js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  html = html.replace(
    new RegExp(`<script[^>]*${jsFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*></script>`, 'g'),
    `<script type="module">${js}</script>`
  );
}

html = html.replace(/\/vite\.svg/g, 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%2316a34a"/><text x="16" y="21" font-size="14" text-anchor="middle" fill="white" font-family="sans-serif">CF</text></svg>');

const outPath = path.join(distDir, 'campusflow-standalone.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Single file created:', outPath);
console.log('Size:', (fs.statSync(outPath).size / 1024 / 1024).toFixed(2), 'MB');
