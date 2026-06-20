import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Dashboard from './components/Dashboard';
import PublishModal from './components/PublishModal';
import FloatingButton from './components/FloatingButton';
import Login from './components/Login';
import Register from './components/Register';
import productsData from './data/products.json';
import usersData from './data/users.json';
import { logout, getCurrentUser } from './store/authStore';

function App() {
  // 视图状态：'home' | 'login' | 'register'
  const [view, setView] = useState('home');
  // 用户状态
  const [user, setUser] = useState(null);
  // 商品与交互状态
  const [products, setProducts] = useState(productsData);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState(null);

  // 初始化：检查是否有登录会话
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // 搜索和筛选逻辑
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      return matchSearch && matchCategory;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [products, searchTerm, activeCategory]);

  const getSeller = (sellerId) => {
    const fromData = usersData.find((u) => u.id === sellerId);
    if (fromData) return fromData;
    // 当前登录用户匹配
    if (user && user.id === sellerId) return user;
    return usersData[0];
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('home');
    showToast(`欢迎回来，${userData.name}！🎉`, 'success');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setView('home');
    showToast(`注册成功！欢迎加入校园智转，${userData.name}！🌱`, 'success');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    showToast('已退出登录，再见！👋');
  };

  const handlePublish = (newProduct) => {
    const product = {
      ...newProduct,
      id: `p${Date.now()}`,
      matchScore: 80 + Math.floor(Math.random() * 15),
      matchFactor: '基于新鲜度推荐',
      sellerId: user ? user.id : 'u1',
      condition: '全新',
      location: user?.school || '我的大学',
      views: 0,
      likes: 0,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setProducts([product, ...products]);
    setShowPublish(false);
    showToast('发布成功！闲置物品已上架 🎉');
  };

  // 登录/注册视图
  if (view === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setView('register')}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setView('login')}
        onBack={() => setView('home')}
      />
    );
  }

  // 主页视图
  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50/60 to-white">
      <Header
        onOpenDashboard={() => setShowDashboard(true)}
        user={user}
        onLogin={() => setView('login')}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <section className="pt-6 pb-4 animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eco-600 via-eco-500 to-emerald-400 p-6 sm:p-10 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="absolute top-1/4 right-10 w-20 h-20 bg-white/10 rounded-full hidden md:block" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm mb-4">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                校园智转 · 让闲置流动起来 · CampusFlow
              </div>
              <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight leading-tight">
                闲置物品，<span className="text-white/90">智能流转</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-2xl mb-6 leading-relaxed">
                基于用户行为大数据的校园闲置物品智能匹配平台，通过用户画像聚类与供需匹配算法，
                让每一件闲置物品找到最合适的新主人。<span className="font-semibold">环保 · 高效 · 绿色校园</span>
              </p>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              {searchTerm && (
                <div className="mt-3 text-sm text-white/80">
                  🔍 正在搜索「<span className="font-semibold">{searchTerm}</span>」· 找到 {filteredProducts.length} 件匹配物品
                </div>
              )}
            </div>
          </div>
        </section>

        <CategoryNav active={activeCategory} onChange={setActiveCategory} />

        <section className="mt-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-eco-600">✨</span> 猜你喜欢 · 智能推荐
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                基于浏览、收藏与偏好画像，为您匹配 {filteredProducts.length} 件闲置好物
              </p>
            </div>
            <button
              onClick={() => setShowDashboard(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-eco-200 text-eco-700 rounded-xl hover:bg-eco-50 transition-colors shadow-sm text-sm font-medium"
            >
              📊 数据看板
            </button>
          </div>

          <ProductGrid products={filteredProducts} onSelect={setSelectedProduct} />

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">暂无匹配物品</h3>
              <p className="text-sm text-slate-500 mb-4">试试其他关键词，或发布一件新的闲置物品</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 bg-eco-600 text-white rounded-xl font-medium text-sm hover:bg-eco-700 transition-colors"
              >
                查看全部
              </button>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard
              icon="🎯"
              title="智能匹配算法"
              desc="分析用户画像、浏览搜索收藏数据，实现供需精准匹配"
              color="from-emerald-50 to-white border-emerald-200 text-emerald-700"
            />
            <FeatureCard
              icon="📊"
              title="数据可视化分析"
              desc="实时展示品类热度、交易时段、用户画像聚类等关键指标"
              color="from-blue-50 to-white border-blue-200 text-blue-700"
            />
            <FeatureCard
              icon="🌱"
              title="循环经济理念"
              desc="盘活校园闲置物资，减少资源浪费，倡导绿色低碳生活"
              color="from-amber-50 to-white border-amber-200 text-amber-700"
            />
          </div>
        </section>
      </main>

      <FooterSimple />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          seller={getSeller(selectedProduct.sellerId)}
          onClose={() => setSelectedProduct(null)}
          onToast={showToast}
        />
      )}

      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}

      {showPublish && (
        <PublishModal onClose={() => setShowPublish(false)} onPublish={handlePublish} />
      )}

      <FloatingButton onClick={() => setShowPublish(true)} />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl text-white font-medium text-sm ${toast.type === 'success' ? 'bg-eco-600' : 'bg-slate-800'}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${color}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function FooterSimple() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍃</span>
              </div>
              <span className="font-bold text-slate-900">校园智转</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              基于用户行为大数据的校园闲置物品智能匹配流转平台，
              让每一件闲置物品焕发新生。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-sm">核心功能</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>智能商品推荐</li>
              <li>用户画像聚类</li>
              <li>数据可视化看板</li>
              <li>信用评分体系</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-sm">平台理念</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>🌱 环保 · 循环经济</li>
              <li>🎯 精准 · 智能匹配</li>
              <li>🤝 信任 · 校园社区</li>
              <li>📊 数据 · 科学决策</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-5 text-center">
          <p className="text-xs text-slate-500">
            © 2024 校园智转 CampusFlow · 让闲置流动起来
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;
