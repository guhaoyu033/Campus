// 为每件商品生成小红书风格的SVG商品卡片图
const fs = require('fs');
const path = require('path');

// 18件商品的专属配色方案（小红书风格：柔和渐变 + 高识别度）
const products = [
  {
    id: "p1",
    title: "九成新 iPad Air 5 64G",
    price: 2899,
    originalPrice: 4799,
    category: "数码电子",
    gradient: ["#667eea", "#764ba2"],
    accent: "#f093fb",
    emoji: "📱",
    tag: "苹果生态",
    matchScore: 98,
    matchFactor: "基于浏览/收藏偏好",
    description: "毕业季闲置，用了不到半年，成色9成新，原装充电器都在，欢迎小刀。",
    sellerId: "u3",
    condition: "9成新",
    location: "浙江大学",
    views: 234,
    likes: 56,
    publishedAt: "2024-06-10",
    liked: false
  },
  {
    id: "p2",
    title: "高等数学教材 同济七版",
    price: 15,
    originalPrice: 45,
    category: "教材书籍",
    gradient: ["#f6d365", "#fda085"],
    accent: "#ff8a00",
    emoji: "📚",
    tag: "新生必备",
    matchScore: 95,
    matchFactor: "基于专业匹配 + 新生画像",
    description: "少量笔记，整体品相好，适合大一新生预习高数。",
    sellerId: "u2",
    condition: "8成新",
    location: "北京大学",
    views: 189,
    likes: 42,
    publishedAt: "2024-06-12",
    liked: false
  },
  {
    id: "p3",
    title: "小米电动滑板车 1S",
    price: 1299,
    originalPrice: 2199,
    category: "出行工具",
    gradient: ["#fa709a", "#fee140"],
    accent: "#ff4e50",
    emoji: "🛴",
    tag: "校园代步",
    matchScore: 92,
    matchFactor: "基于距离优先推荐 · 同校区",
    description: "校园代步神器，续航20公里，附带原装充电器，诚心出。",
    sellerId: "u5",
    condition: "8成新",
    location: "上海交通大学",
    views: 312,
    likes: 78,
    publishedAt: "2024-06-08",
    liked: false
  },
  {
    id: "p4",
    title: "Nike Air Zoom 跑鞋",
    price: 399,
    originalPrice: 899,
    category: "运动户外",
    gradient: ["#f093fb", "#f5576c"],
    accent: "#fff1eb",
    emoji: "👟",
    tag: "运动装备",
    matchScore: 88,
    matchFactor: "基于浏览偏好 + 运动画像",
    description: "42码，只穿过几次，鞋盒都在，成色完美。",
    sellerId: "u5",
    condition: "9成新",
    location: "上海交通大学",
    views: 145,
    likes: 31,
    publishedAt: "2024-06-11",
    liked: false
  },
  {
    id: "p5",
    title: "MacBook Pro 14 寸 M1 Pro",
    price: 6800,
    originalPrice: 14999,
    category: "数码电子",
    gradient: ["#4facfe", "#00f2fe"],
    accent: "#2d1b69",
    emoji: "💻",
    tag: "程序员利器",
    matchScore: 96,
    matchFactor: "基于专业/收藏偏好",
    description: "16G+512G，深空灰，程序员毕业闲置，性能无任何问题。",
    sellerId: "u3",
    condition: "9成新",
    location: "浙江大学",
    views: 567,
    likes: 123,
    publishedAt: "2024-06-05",
    liked: false
  },
  {
    id: "p6",
    title: "宿舍学习桌椅套装",
    price: 120,
    originalPrice: 399,
    category: "生活用品",
    gradient: ["#fccb90", "#d57eeb"],
    accent: "#ffffff",
    emoji: "🪑",
    tag: "宿舍好物",
    matchScore: 85,
    matchFactor: "基于新生偏好推荐",
    description: "毕业清仓，自提，宿舍必备，结实耐用。桌椅组合打包出。",
    sellerId: "u4",
    condition: "7成新",
    location: "复旦大学",
    views: 98,
    likes: 22,
    publishedAt: "2024-06-14",
    liked: false
  },
  {
    id: "p7",
    title: "Kindle Paperwhite 11 代",
    price: 499,
    originalPrice: 998,
    category: "数码电子",
    gradient: ["#a8edea", "#fed6e3"],
    accent: "#ff758c",
    emoji: "📖",
    tag: "读书神器",
    matchScore: 91,
    matchFactor: "基于阅读偏好推荐",
    description: "32G，无划痕，电池健康度98%，看书神器。",
    sellerId: "u2",
    condition: "9成新",
    location: "北京大学",
    views: 178,
    likes: 45,
    publishedAt: "2024-06-09",
    liked: false
  },
  {
    id: "p8",
    title: "毕业礼服学士服 女款",
    price: 88,
    originalPrice: 299,
    category: "服装配饰",
    gradient: ["#ff9a9e", "#fecfef"],
    accent: "#d8247c",
    emoji: "🎓",
    tag: "毕业季限定",
    matchScore: 82,
    matchFactor: "基于毕业季推荐",
    description: "拍照仅穿一次，M 码，附带领结、校徽装饰。",
    sellerId: "u4",
    condition: "全新",
    location: "复旦大学",
    views: 256,
    likes: 67,
    publishedAt: "2024-06-13",
    liked: false
  },
  {
    id: "p9",
    title: "AirPods Pro 2 二代",
    price: 999,
    originalPrice: 1899,
    category: "数码电子",
    gradient: ["#e0eafc", "#cfdef3"],
    accent: "#434343",
    emoji: "🎧",
    tag: "降噪神器",
    matchScore: 97,
    matchFactor: "基于数码偏好 + 搜索关键词",
    description: "使用半年，功能完好，降噪效果绝绝子，充电线全新。",
    sellerId: "u1",
    condition: "9成新",
    location: "清华大学",
    views: 445,
    likes: 98,
    publishedAt: "2024-06-07",
    liked: false
  },
  {
    id: "p10",
    title: "英语四六级真题资料 全套",
    price: 20,
    originalPrice: 68,
    category: "教材书籍",
    gradient: ["#84fab0", "#8fd3f4"],
    accent: "#11998e",
    emoji: "📝",
    tag: "考证必备",
    matchScore: 90,
    matchFactor: "基于学习偏好 + 专业画像",
    description: "含近十年真题+答案解析，助你四六级一次通过。",
    sellerId: "u1",
    condition: "9成新",
    location: "清华大学",
    views: 267,
    likes: 89,
    publishedAt: "2024-06-06",
    liked: false
  },
  {
    id: "p11",
    title: "Giant ATX 山地自行车",
    price: 599,
    originalPrice: 1599,
    category: "出行工具",
    gradient: ["#43e97b", "#38f9d7"],
    accent: "#0b486b",
    emoji: "🚲",
    tag: "通勤出行",
    matchScore: 86,
    matchFactor: "基于户外偏好 + 距离匹配",
    description: "骑行约3000公里，保养良好，26寸，适合校园通勤。",
    sellerId: "u5",
    condition: "8成新",
    location: "上海交通大学",
    views: 189,
    likes: 43,
    publishedAt: "2024-06-11",
    liked: false
  },
  {
    id: "p12",
    title: "罗技 MX Master 3S 鼠标",
    price: 499,
    originalPrice: 899,
    category: "数码电子",
    gradient: ["#2af598", "#009efd"],
    accent: "#093028",
    emoji: "🖱️",
    tag: "生产力工具",
    matchScore: 93,
    matchFactor: "基于程序员画像推荐",
    description: "编程神器，人体工学设计，使用3个月，几乎全新。",
    sellerId: "u3",
    condition: "9成新",
    location: "浙江大学",
    views: 201,
    likes: 54,
    publishedAt: "2024-06-10",
    liked: false
  },
  {
    id: "p13",
    title: "雅马哈 F310 民谣吉他",
    price: 450,
    originalPrice: 899,
    category: "运动户外",
    gradient: ["#fcb69f", "#ffecd2"],
    accent: "#8b5a2b",
    emoji: "🎸",
    tag: "兴趣爱好",
    matchScore: 84,
    matchFactor: "基于兴趣画像推荐",
    description: "41寸，原木色，弦距舒适，适合新手练习。",
    sellerId: "u4",
    condition: "8成新",
    location: "复旦大学",
    views: 156,
    likes: 38,
    publishedAt: "2024-06-04",
    liked: false
  },
  {
    id: "p14",
    title: "小米 5L 迷你电热水壶",
    price: 49,
    originalPrice: 99,
    category: "生活用品",
    gradient: ["#ffecd2", "#fcb69f"],
    accent: "#ff6a00",
    emoji: "🫖",
    tag: "宿舍小家电",
    matchScore: 80,
    matchFactor: "基于新生宿舍画像",
    description: "宿舍神器，烧水壶小巧不占空间，毕业出清。",
    sellerId: "u2",
    condition: "9成新",
    location: "北京大学",
    views: 112,
    likes: 25,
    publishedAt: "2024-06-15",
    liked: false
  },
  {
    id: "p15",
    title: "机械键盘 Cherry 红轴 87键",
    price: 288,
    originalPrice: 599,
    category: "数码电子",
    gradient: ["#667eea", "#764ba2"],
    accent: "#ffdd00",
    emoji: "⌨️",
    tag: "极客装备",
    matchScore: 94,
    matchFactor: "基于程序员/游戏画像",
    description: "使用一年，红轴，手感极佳，PBT键帽不打油。",
    sellerId: "u3",
    condition: "9成新",
    location: "浙江大学",
    views: 289,
    likes: 61,
    publishedAt: "2024-06-03",
    liked: false
  },
  {
    id: "p16",
    title: "健身瑜伽垫 + 弹力带套装",
    price: 58,
    originalPrice: 168,
    category: "运动户外",
    gradient: ["#5ee7df", "#b490ca"],
    accent: "#ffffff",
    emoji: "🧘",
    tag: "健身必备",
    matchScore: 83,
    matchFactor: "基于健身兴趣画像",
    description: "薄荷绿，TPE材质，6mm厚度防滑，附带5条弹力带。",
    sellerId: "u4",
    condition: "8成新",
    location: "复旦大学",
    views: 134,
    likes: 29,
    publishedAt: "2024-06-02",
    liked: false
  },
  {
    id: "p17",
    title: "小米桌面风扇 2 档风速",
    price: 89,
    originalPrice: 199,
    category: "生活用品",
    gradient: ["#a1c4fd", "#c2e9fb"],
    accent: "#2193b0",
    emoji: "🌀",
    tag: "夏日清凉",
    matchScore: 81,
    matchFactor: "基于夏季需求画像",
    description: "USB供电，静音效果好，宿舍书桌必备。",
    sellerId: "u2",
    condition: "9成新",
    location: "北京大学",
    views: 98,
    likes: 18,
    publishedAt: "2024-06-16",
    liked: false
  },
  {
    id: "p18",
    title: "专业考研全套资料（数学+英语+政治）",
    price: 128,
    originalPrice: 499,
    category: "教材书籍",
    gradient: ["#f093fb", "#f5576c"],
    accent: "#fff200",
    emoji: "📚",
    tag: "考研必备",
    matchScore: 92,
    matchFactor: "基于考研用户画像",
    description: "考研党的福音，含张宇数学、肖秀荣政治、何凯文英语全套笔记。",
    sellerId: "u1",
    condition: "8成新",
    location: "清华大学",
    views: 445,
    likes: 112,
    publishedAt: "2024-06-01",
    liked: false
  }
];

// 生成单个SVG商品卡片
function generateProductSVG(product, index) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const [g1, g2] = product.gradient;
  
  // 为每件商品生成稍有不同的装饰图案
  const patternId = `pattern-${product.id}`;
  const gradId = `grad-${product.id}`;
  
  // 显示价格 - 过长的标题用换行处理
  const displayTitle = product.title.length > 12 
    ? product.title.slice(0, 12) + '...' 
    : product.title;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${g1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${g2};stop-opacity:1" />
    </linearGradient>
    <filter id="softShadow-${product.id}">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="400" fill="url(#${gradId})"/>
  
  <!-- 装饰性圆点（小红书风格） -->
  <circle cx="60" cy="60" r="80" fill="white" fill-opacity="0.08"/>
  <circle cx="340" cy="340" r="100" fill="white" fill-opacity="0.06"/>
  <circle cx="350" cy="80" r="40" fill="white" fill-opacity="0.05"/>
  <circle cx="50" cy="320" r="35" fill="white" fill-opacity="0.05"/>
  
  <!-- 装饰线条 -->
  <line x1="0" y1="380" x2="400" y2="380" stroke="white" stroke-width="2" stroke-opacity="0.15"/>
  <line x1="0" y1="370" x2="400" y2="370" stroke="white" stroke-width="1" stroke-opacity="0.1"/>
  
  <!-- 右上角分类标签 -->
  <rect x="220" y="30" width="150" height="38" rx="19" fill="white" fill-opacity="0.95"/>
  <text x="295" y="55" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="15" font-weight="600" fill="${product.accent}" text-anchor="middle">${product.tag}</text>
  
  <!-- 左上角折扣标 -->
  <rect x="30" y="30" width="85" height="38" rx="19" fill="${product.accent}" fill-opacity="0.95"/>
  <text x="72" y="55" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="15" font-weight="700" fill="white" text-anchor="middle">${discount}%OFF</text>
  
  <!-- 主商品图标（大Emoji） -->
  <text x="200" y="210" font-size="110" text-anchor="middle" opacity="0.95">${product.emoji}</text>
  
  <!-- 底部商品名卡片 -->
  <rect x="30" y="280" width="340" height="95" rx="20" fill="white" fill-opacity="0.96" filter="url(#softShadow-${product.id})"/>
  
  <!-- 商品名 -->
  <text x="55" y="318" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="20" font-weight="700" fill="#1a1a2e" text-anchor="start">${displayTitle}</text>
  
  <!-- 分类小标签 -->
  <rect x="55" y="332" width="68" height="22" rx="11" fill="${g2}" fill-opacity="0.18"/>
  <text x="89" y="348" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="11" font-weight="500" fill="${product.accent}" text-anchor="middle">${product.category}</text>
  
  <!-- 价格 -->
  <text x="55" y="368" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="14" font-weight="500" fill="#999" text-decoration="line-through">¥${product.originalPrice}</text>
  <text x="220" y="368" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="30" font-weight="800" fill="#ff4e50" text-anchor="start">¥${product.price}</text>
  
  <!-- 匹配度标签 -->
  <circle cx="350" cy="110" r="38" fill="white" fill-opacity="0.95" filter="url(#softShadow-${product.id})"/>
  <text x="350" y="108" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="11" font-weight="500" fill="#666" text-anchor="middle">🔥匹配度</text>
  <text x="350" y="130" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="18" font-weight="800" fill="#ff4e50" text-anchor="middle">${product.matchScore}%</text>
</svg>`;
}

// SVG 转 data URI
function svgToDataUri(svg) {
  // 直接 encodeURIComponent，不需要特殊处理
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// 主逻辑：生成带图片的商品数据
const productsWithImages = products.map((p, i) => {
  const svg = generateProductSVG(p, i);
  return { ...p, image: svgToDataUri(svg) };
});

// 写入 JSON 文件
const outputPath = path.join(__dirname, 'src', 'data', 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(productsWithImages, null, 2), 'utf-8');

console.log(`✅ 已生成 ${productsWithImages.length} 张小红书风格商品卡片图`);
console.log(`📁 输出路径: ${outputPath}`);
console.log(`💡 SVG尺寸: 400×400`);
