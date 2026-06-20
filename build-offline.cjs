#!/usr/bin/env node
// 生成校园智转离线单文件 HTML
// 把所有 CSS/JS 内联到一个 HTML 文件中

const fs = require('fs');
const path = require('path');

const distDir = '/workspace/campusflow/dist';
const outputPath = path.join(distDir, 'campusflow-offline.html');

console.log('正在生成离线单文件版...');

// 读取 index.html
const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// 查找 assets 目录中的文件
const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('❌ 未找到 JS/CSS 文件');
  process.exit(1);
}

console.log(`📦 JS: ${jsFile}`);
console.log(`📦 CSS: ${cssFile}`);

const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');

// 生成最终 HTML
const finalHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#16a34a" />
<title>校园智转 CampusFlow · 闲置物品智能匹配流转平台</title>
<meta name="description" content="基于用户行为大数据的校园闲置物品智能匹配流转平台" />
<style>
${cssContent}
</style>
</head>
<body>
<div id="root"></div>
<script>
// 在 file:// 本地打开时，绕过 type=module 的 CORS 限制
window.addEventListener('DOMContentLoaded', function() {
  var code = document.getElementById('campusflow-app-code').textContent;
  var blob = new Blob([code], { type: 'application/javascript' });
  var url = URL.createObjectURL(blob);
  var s = document.createElement('script');
  s.type = 'module';
  s.src = url;
  document.head.appendChild(s);
});
</script>
<script id="campusflow-app-code" type="text/plain">
${jsContent}
</script>
</body>
</html>
`;

fs.writeFileSync(outputPath, finalHtml);
const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
console.log(`\n✅ 生成成功: ${outputPath} (约 ${sizeKB} KB)`);
console.log(`\n💡 使用方式:`);
console.log(`   · 双击 campusflow-offline.html 直接在浏览器中打开`);
console.log(`   · 或部署到任何静态托管服务 (Netlify Drop / GitHub Pages / Vercel)`);
console.log(`   · 或作为 demo 分享给他人查看`);
