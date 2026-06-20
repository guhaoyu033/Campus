# 校园智转 CampusFlow · 闲置物品智能匹配流转平台

> 基于用户行为大数据的校园闲置物品智能流转平台
> React + Vite + Tailwind CSS + Recharts + Lucide Icons

---

## 🚀 快速开始（30 秒获得公网链接）

### 方式 1：Netlify Drop · 最推荐 · 零配置

**只需一步**：打开 <https://app.netlify.com/drop>，把 `dist` 文件夹拖到页面里，10 秒后获得形如 `https://xxx.netlify.app` 的公网链接！

### 方式 2：Windows 一键部署

双击 `一键部署.bat`，选择 `4` 打开 Netlify Drop 网页，拖放部署。

### 方式 3：Mac/Linux 一键部署

```bash
./一键部署.sh  # 然后选择 4
```

### 方式 4：命令行部署（需要 Node.js）

```bash
# Netlify
npx netlify-cli deploy --prod --dir=dist

# 或者 Vercel
npx vercel --prod --yes
```

### 方式 5：本地预览（无需部署）

```bash
# 双击即可（推荐转发他人）
dist/campusflow-offline.html

# 或本地服务器
python3 -m http.server 8088  # 然后访问 http://localhost:8088
```

---

## 📁 文件保存到 Windows

把整个 `campusflow` 文件夹复制到你的 Windows 电脑，比如：

```
C:\Users\lenovo\OneDrive\桌面\Trae创意\校园闲置\
    ├── dist/                           ← 部署时只需上传这个文件夹
    │   ├── index.html                  ← 标准入口
    │   ├── campusflow-offline.html     ← 单文件离线版（双击打开）
    │   └── assets/                     ← 打包好的 JS/CSS
    ├── 一键部署-双击打开.html            ← 部署指南网页（本页的美化版）
    ├── 一键部署.bat                    ← Windows 部署脚本
    ├── 一键部署.sh                     ← Mac/Linux 部署脚本
    ├── README.md                       ← 说明文档（本文件）
    ├── package.json                    ← 项目配置
    ├── vite.config.js                  ← Vite 构建配置
    ├── tailwind.config.js              ← Tailwind 主题配置
    └── src/                            ← 源代码（开发用）
        ├── main.jsx                    ← 入口
        ├── App.jsx                     ← 主应用组件
        ├── components/                 ← 功能组件
        ├── data/                       ← Mock 数据
        └── index.css                   ← 全局样式
```

**复制步骤**（Windows）：
1. 把整个 `campusflow` 文件夹复制到 `C:\Users\lenovo\OneDrive\桌面\Trae创意\校园闲置\`
2. 在 Windows 中双击 `一键部署-双击打开.html` 查看部署指南
3. 打开 <https://app.netlify.com/drop>，拖放 `dist` 文件夹即可获得公网链接

---

## ✨ 功能模块

| 模块 | 说明 |
|------|------|
| 🏠 首页智能推荐流 | 展示「猜你喜欢」列表，每张卡片包含匹配度标签（如「98%匹配」）和匹配因子说明 |
| 🔍 搜索 + 分类导航 | 顶部搜索框 + 7 大分类（数码电子、图书教材、服饰鞋包、生活用品、运动户外、美妆护肤、其他） |
| 📊 数据可视化看板 | 柱状图展示热门品类 TOP5，折线图展示交易活跃时段，大字统计累计减碳量 |
| 🛒 商品详情弹窗 | 点击卡片展开商品详情页，展示卖家信用评分、浏览收藏数据，底部有「我想要」「一键私信」按钮 |
| ➕ 发布入口 | 右下角悬浮「+」按钮，弹出发布表单（名称、价格、分类、图片占位、描述） |
| 📱 响应式设计 | Mobile First，完美兼容手机和桌面端 |
| 🎨 极简年轻化设计 | 环保绿主色调，卡片悬停动画，页面切换平滑动效 |

---

## 🔧 重新构建（开发用）

如果需要修改源码后重新构建：

```bash
cd campusflow
npm install
npm run build     # 产物输出到 dist/
npm run dev       # 开发模式，热更新
```

构建配置：
- **Vite**：`base: './'`（相对路径，支持 file:// 和子目录部署）
- **Tailwind CSS**：自定义环保绿主题色、动画关键帧
- **Lucide React**：图标库
- **Recharts**：图表库

---

## 🌐 部署方案对比

| 方案 | 难度 | 时间 | 免费 | 自定义域名 | 说明 |
|------|------|------|------|------------|------|
| **Netlify Drop** | ⭐ 极低 | 10 秒 | ✓ | ✓ | 拖放即部署，最推荐 |
| **Vercel** | ⭐⭐ 低 | 30 秒 | ✓ | ✓ | `npx vercel --prod` |
| **Cloudflare Pages** | ⭐⭐ 低 | 1 分钟 | ✓ | ✓ | 全球 CDN 加速 |
| **GitHub Pages** | ⭐⭐ 中 | 2 分钟 | ✓ | ✓ | 需要 GitHub 账号 |
| **本地离线版** | ⭐ 极低 | 0 秒 | ✓ | - | 双击 `campusflow-offline.html` |

---

## 📋 常见问题

**Q: 为什么双击 `dist/index.html` 白屏？**
A: 因为它用 ES module + 外部 JS 文件，`file://` 协议下浏览器会拦截。请用 `campusflow-offline.html`（单文件内嵌版），或通过 HTTP 服务器访问。

**Q: 部署后链接是 `https://random-name.netlify.app`，能改吗？**
A: 可以。在 Netlify 站点设置 → Site settings → Change site name，改成你想要的名字（如 `campusflow.netlify.app`）。

**Q: 如何部署到 GitHub Pages？**
A: 把 `dist` 目录的内容推到一个 GitHub repo，设置 Pages 的 source 为该分支。或使用 `gh-pages` npm 包：
```bash
npm install -D gh-pages
npx gh-pages -d dist
```

**Q: 数据是真实的吗？**
A: Demo 版本使用 Mock JSON 数据（`src/data/` 目录下）。如需接入真实后端，替换数据即可。

---

## 🌱 关于项目

校园智转 CampusFlow 旨在通过大数据匹配，让校园内的闲置物品高效流转起来。减少资源浪费，践行环保理念。

- **理念**：让每一件闲置物品焕发新生
- **技术**：React + Vite + Tailwind CSS（前端）
- **版本**：v1.0 · Demo

---

*校园智转 CampusFlow · 让闲置流转起来 🌱*
