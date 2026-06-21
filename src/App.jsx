import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Dashboard from './components/Dashboard';
import PublishModal from './components/PublishModal';
import FloatingButton from './components/FloatingButton';
import MyListings from './components/MyListings';
import MyFavorites from './components/MyFavorites';
import UserProfile from './components/UserProfile';
import ChatPanel from './components/ChatPanel';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';
import Login from './components/Login';
import Register from './components/Register';
import productsData from './data/products.json';
import messagesData from './data/messages.json';
import usersData from './data/users.json';
import localStore from './store/localStore';

function App() {
  const [user, setUser] = useState(() => localStore.getUser());
  const [addressBook, setAddressBook] = useState(() => localStore.getAddressBook());
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [products, setProducts] = useState(() =>
    localStore.getProducts(productsData.map(p => ({ ...p, status: p.status || 'active' })))
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [showMyFavorites, setShowMyFavorites] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [toast, setToast] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [cart, setCart] = useState(() => localStore.getCart());
  const [orders, setOrders] = useState(() => localStore.getOrders());
  const [viewHistory, setViewHistory] = useState(() => localStore.getViewHistory());
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [dynamicChats, setDynamicChats] = useState(() => localStore.getDynamicChats());
  const [showNotifications, setShowNotifications] = useState(false);

  // === localStorage 自动同步 ===
  useEffect(() => localStore.setUser(user), [user]);
  useEffect(() => localStore.setProducts(products), [products]);
  useEffect(() => localStore.setCart(cart), [cart]);
  useEffect(() => localStore.setOrders(orders), [orders]);
  useEffect(() => localStore.setAddressBook(addressBook), [addressBook]);
  useEffect(() => localStore.setViewHistory(viewHistory), [viewHistory]);
  useEffect(() => {
    const ids = dynamicChats.map(c => c.id);
    const stored = localStore.getDynamicChats().map(c => c.id);
    if (JSON.stringify(ids) !== JSON.stringify(stored)) {
      localStore.setDynamicChats(dynamicChats);
    }
  }, [dynamicChats]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchPrice = (
        (priceRange.min === '' || parseFloat(p.price) >= parseFloat(priceRange.min)) &&
        (priceRange.max === '' || parseFloat(p.price) <= parseFloat(priceRange.max))
      );
      return matchSearch && matchCategory && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'priceDesc') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'newest') return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      return (b.matchScore || 80) - (a.matchScore || 80);
    });
  }, [products, searchTerm, activeCategory, sortBy, priceRange]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleLike = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            liked: !product.liked,
            likes: product.liked ? (product.likes || 0) - 1 : (product.likes || 0) + 1
          };
        }
        return product;
      })
    );
  };

  const handleAddComment = (productId, comment) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            comments: [comment, ...(product.comments || [])]
          };
        }
        return product;
      })
    );
  };

  const handleSellerReply = (productId, commentId, replyText) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedComments = (product.comments || []).map(c => {
            if (c.id === commentId) {
              return { ...c, sellerReply: replyText };
            }
            return c;
          });
          return { ...product, comments: updatedComments };
        }
        return product;
      })
    );
  };

  const handleToggleCommentLike = (productId, commentId) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedComments = (product.comments || []).map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                liked: !c.liked,
                likes: c.liked ? (c.likes || 0) - 1 : (c.likes || 0) + 1
              };
            }
            return c;
          });
          return { ...product, comments: updatedComments };
        }
        return product;
      })
    );
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, views: (p.views || 0) + 1 } : p
    ));
    setViewHistory(prev => {
      const filtered = prev.filter(id => id !== product.id);
      return [product.id, ...filtered].slice(0, 20);
    });
  };

  const handleUpdateProductStatus = (productId, newStatus) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, status: newStatus } : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddToCart = (productId, qty = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId, qty, addedAt: new Date().toISOString() }];
    });
    showToast(`已加入购物车：${product.title} 🛒`, 'success');
  };

  const handleUpdateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
    } else {
      setCart(prev => prev.map(i =>
        i.productId === productId ? { ...i, qty } : i
      ));
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckout = (items, address) => {
    const newOrders = items.map((item, idx) => {
      const p = products.find(x => x.id === item.productId);
      return {
        id: `o${Date.now()}_${idx}`,
        productId: item.productId,
        productTitle: p?.title || '商品',
        productImage: p?.image,
        price: p?.price || 0,
        qty: item.qty,
        total: (p?.price || 0) * item.qty,
        status: 'pending',
        sellerId: p?.sellerId,
        address: address,
        createdAt: new Date().toISOString()
      };
    });
    setOrders(prev => [...newOrders, ...prev]);
    newOrders.forEach(o => {
      setProducts(prev => prev.map(p =>
        p.id === o.productId ? { ...p, status: 'sold', stock: 0 } : p
      ));
    });
    setCart([]);
    showToast(`下单成功！共 ${newOrders.length} 件商品 🎉`, 'success');
  };

  const handlePublish = (newProduct) => {
    const product = {
      ...newProduct,
      id: `p${Date.now()}`,
      price: parseFloat(newProduct.price) || 0,
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : (parseFloat(newProduct.price) * 2),
      liked: false,
      status: 'active',
      matchScore: 80 + Math.floor(Math.random() * 15),
      matchFactor: '基于新鲜度推荐',
      sellerId: user ? user.id : 'u1',
      location: newProduct.location || (user?.school || '我的学校'),
      views: 0,
      likes: 0,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setProducts([product, ...products]);
    setShowPublish(false);
    showToast('🎉 发布成功！你的闲置商品已上架');
  };

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleUserLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowRegister(false);
    setAddressBook([]);
    setSelectedAddressId(null);
    showToast(`欢迎回来，${userData.name || '同学'}！🎉`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setAddressBook([]);
    setSelectedAddressId(null);
    setShowAddressModal(false);
    setSelectedChat(null);
    showToast('已退出登录，再见！👋');
  };

  const handleUpdateUser = (formData) => {
    const nextUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      school: formData.school,
      bio: formData.bio,
      phone: formData.phone,
      wechat: formData.wechat,
      gender: formData.gender,
      department: formData.department,
      enrollYear: formData.enrollYear,
      avatar: formData.avatar,
      addresses: Array.isArray(formData.addresses) ? formData.addresses : (user?.addresses || [])
    };
    setUser(nextUser);
    if (Array.isArray(formData.addresses)) {
      setAddressBook(formData.addresses);
    }
  };

  const handleAddAddress = (addr) => {
    if (!addr) return;
    setAddressBook(prev => {
      const isFirst = prev.length === 0;
      const shouldDefault = !!addr.isDefault || isFirst;
      const id = (typeof addr.id === 'string' && addr.id.startsWith('a')) ? addr.id : `a${Date.now()}`;
      const normalized = {
        ...addr,
        id,
        isDefault: shouldDefault
      };
      let next = [normalized, ...prev];
      if (shouldDefault) {
        next = next.map((a, i) => (i === 0 ? { ...a, isDefault: true } : { ...a, isDefault: false }));
      }
      if (!selectedAddressId) {
        setSelectedAddressId(id);
      }
      return next;
    });
  };

  const handleSaveAddressBook = (addresses) => {
    if (Array.isArray(addresses)) {
      setAddressBook(addresses);
    }
  };

  const handleOpenChat = (chatIdOrOptions) => {
    let chat;
    if (typeof chatIdOrOptions === 'string') {
      // 优先在动态聊天中查找（localStorage 持久化）
      chat = dynamicChats.find(c => c.id === chatIdOrOptions);
      if (!chat) chat = messagesData.chats.find(c => c.id === chatIdOrOptions);
    } else {
      const { product, seller } = chatIdOrOptions;
      // 先在动态聊天中查找（同一卖家）
      chat = dynamicChats.find(c => c.userId === seller?.id);
      if (!chat) chat = messagesData.chats.find(c => c.userId === seller?.id);
      if (!chat && seller) {
        chat = {
          id: `chat:dynamic_${Date.now()}`,
          userId: seller.id,
          name: seller.name || '卖家同学',
          avatar: seller.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.id}`,
          school: seller.school || user?.school || '校园',
          lastMessage: '',
          time: '刚刚',
          unread: false,
          product: product?.title,
          productId: product?.id,
          productImage: product?.image,
          productPrice: product?.price,
          messages: []
        };
        // 持久化到 localStorage
        setDynamicChats(prev => {
          if (prev.some(c => c.userId === seller.id)) return prev;
          return [...prev, chat];
        });
      }
    }
    if (chat) {
      setSelectedChat(chat);
    }
  };

  const quickFilters = [
    { key: 'match', label: '智能推荐', icon: '✨' },
    { key: 'newest', label: '最新发布', icon: '🆕' },
    { key: 'priceAsc', label: '价格从低', icon: '📈' },
    { key: 'priceDesc', label: '价格从高', icon: '📉' },
    { key: 'likes', label: '最多收藏', icon: '❤️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50/60 to-white">
      <Header
        onOpenDashboard={() => setShowDashboard(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenListings={() => setShowMyListings(true)}
        onOpenFavorites={() => setShowMyFavorites(true)}
        onOpenCart={() => setShowCart(true)}
        onOpenOrders={() => setShowOrders(true)}
        cartCount={cart.length}
        ordersCount={orders.length}
        user={user}
        onLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenChat={handleOpenChat}
        dynamicChats={dynamicChats}
        showNotifications={showNotifications}
        onSetNotifications={setShowNotifications}
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

        <section className="mt-4 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700 mr-1">排序：</span>
              {quickFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSortBy(f.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    sortBy === f.key
                      ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-105 border border-slate-200'
                  }`}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700">价格：</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  placeholder="最低"
                  className="w-20 px-3 py-1.5 bg-slate-50 border-2 border-transparent rounded-lg text-xs text-slate-700 focus:border-eco-400 focus:bg-white focus:ring-2 focus:ring-eco-100/50 outline-none transition-all"
                />
                <span className="text-slate-400 text-xs">—</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  placeholder="最高"
                  className="w-20 px-3 py-1.5 bg-slate-50 border-2 border-transparent rounded-lg text-xs text-slate-700 focus:border-eco-400 focus:bg-white focus:ring-2 focus:ring-eco-100/50 outline-none transition-all"
                />
              </div>
              {(priceRange.min !== '' || priceRange.max !== '') && (
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  清除筛选
                </button>
              )}
              <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-bold text-eco-600">{filteredProducts.length}</span>
                <span>件商品</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 animate-slide-up">
          <ProductGrid products={filteredProducts} onSelect={handleSelectProduct} onToggleLike={handleToggleLike} />

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">暂无匹配物品</h3>
              <p className="text-sm text-slate-500 mb-5">试试其他关键词或价格范围，或者发布一件新的闲置物品</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="px-4 py-2.5 bg-eco-600 text-white rounded-xl font-semibold text-sm hover:bg-eco-700 transition-all"
                >
                  查看全部商品
                </button>
                <button
                  onClick={() => setShowPublish(true)}
                  className="px-4 py-2.5 bg-white border-2 border-eco-300 text-eco-700 rounded-xl font-semibold text-sm hover:bg-eco-50 transition-all"
                >
                  + 发布闲置
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-slate-900 mb-1.5">智能匹配算法</h3>
              <p className="text-xs text-slate-600 leading-relaxed">分析用户画像、浏览搜索收藏数据，实现供需精准匹配</p>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-slate-900 mb-1.5">数据可视化分析</h3>
              <p className="text-xs text-slate-600 leading-relaxed">实时展示品类热度、交易时段、用户画像聚类等关键指标</p>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-bold text-slate-900 mb-1.5">循环经济理念</h3>
              <p className="text-xs text-slate-600 leading-relaxed">盘活校园闲置物资，减少资源浪费，倡导绿色低碳生活</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="bg-gradient-to-br from-eco-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl">
            <div className="text-4xl mb-3">🌟</div>
            <h2 className="text-xl sm:text-2xl font-black mb-3">有闲置，来找校园智转</h2>
            <p className="text-sm sm:text-base text-white/80 mb-5 max-w-xl mx-auto leading-relaxed">
              每一件闲置物品都有再次发光的机会，加入我们，让资源流动起来，为环保校园贡献一份力量
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowPublish(true)}
                className="px-6 py-3 bg-white text-eco-700 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                🚀 立即发布闲置
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-sm hover:bg-white/30 transition-all"
              >
                📊 查看数据看板
              </button>
            </div>
          </div>
        </section>
      </main>

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
                基于用户行为大数据的校园闲置物品智能匹配流转平台，让每一件闲置物品焕发新生。
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

      {selectedProduct && (() => {
        const currentProduct = products.find(p => p.id === selectedProduct.id) || selectedProduct;
        const sellerData = usersData.find(u => u.id === currentProduct.sellerId) || {
          id: currentProduct.sellerId || 'u1',
          name: '校园同学',
          school: currentProduct.location || '校园',
          creditScore: 90,
          tradeCount: 10,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentProduct.sellerId || 'u1'}`
        };
        return (
          <ProductDetail
            product={currentProduct}
            user={user}
            seller={sellerData}
            relatedProducts={products.filter(p =>
              p.id !== currentProduct.id &&
              (p.category === currentProduct.category || p.sellerId === currentProduct.sellerId)
            ).slice(0, 6)}
            onClose={() => setSelectedProduct(null)}
            onToast={showToast}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onSellerReply={handleSellerReply}
            onToggleCommentLike={handleToggleCommentLike}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onOpenChat={() => {
              setSelectedProduct(null);
              setTimeout(() => handleOpenChat({ product: currentProduct, seller: sellerData }), 100);
            }}
          />
        );
      })()}

      {selectedChat && (
        <ChatPanel
          chat={selectedChat}
          onClose={() => setSelectedChat(null)}
          products={products}
          onUpdateChat={(chatId, updates) => {
            setDynamicChats(prev => {
              const exists = prev.find(c => c.id === chatId);
              if (exists) {
                return prev.map(c => c.id === chatId ? { ...c, ...updates } : c);
              } else {
                const staticChat = messagesData.chats.find(c => c.id === chatId);
                if (staticChat) {
                  const newDynamic = { ...staticChat, ...updates };
                  return [...prev, newDynamic];
                }
                return prev;
              }
            });
          }}
        />
      )}

      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}

      {showPublish && (
        <PublishModal onClose={() => setShowPublish(false)} onPublish={handlePublish} />
      )}

      {showMyListings && (
        <MyListings
          products={products}
          user={user}
          onClose={() => setShowMyListings(false)}
          onSelectProduct={handleSelectProduct}
          onUpdateStatus={handleUpdateProductStatus}
          onDeleteProduct={handleDeleteProduct}
          onToast={showToast}
        />
      )}

      {showMyFavorites && (
        <MyFavorites
          products={products}
          user={user}
          onClose={() => setShowMyFavorites(false)}
          onToggleLike={handleToggleLike}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onToast={showToast}
        />
      )}

      {showProfile && (
        <UserProfile
          user={user}
          products={products}
          orders={orders}
          cart={cart}
          viewHistory={viewHistory}
          onClose={() => setShowProfile(false)}
          onLogin={handleOpenLogin}
          onToast={showToast}
          onUpdateUser={handleUpdateUser}
          onSaveAddressBook={handleSaveAddressBook}
          onOpenListings={() => { setShowProfile(false); setShowMyListings(true); }}
          onOpenFavorites={() => { setShowProfile(false); setShowMyFavorites(true); }}
          onOpenOrders={() => { setShowProfile(false); setShowOrders(true); }}
        />
      )}

      {showCart && (
        <CartPage
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onUpdateQty={handleUpdateCartQty}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
          onCheckout={handleCheckout}
          onSelectProduct={handleSelectProduct}
          onToast={showToast}
          addressBook={addressBook}
          selectedAddressId={selectedAddressId}
          onSelectAddressId={setSelectedAddressId}
          onAddAddress={handleAddAddress}
          onCloseAddressModal={() => setShowAddressModal(false)}
          showAddressModal={showAddressModal}
          onOpenAddressModal={() => setShowAddressModal(true)}
        />
      )}

      {showOrders && (
        <OrdersPage
          orders={orders}
          products={products}
          onClose={() => setShowOrders(false)}
          onUpdateStatus={(id, status) =>
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
          }
          onToast={showToast}
          onSelectProduct={handleSelectProduct}
        />
      )}

      <div className="fixed bottom-6 left-0 right-0 z-30 flex items-end justify-center sm:justify-end px-4 sm:px-6 gap-2 pointer-events-none">
        {user && (
          <div className="flex flex-col items-center gap-1 pointer-events-auto">
            <button
              onClick={() => setShowCart(true)}
              className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
            <span className="text-[10px] font-bold text-amber-700 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap">购物车</span>
          </div>
        )}
        {user && (
          <div className="flex flex-col items-center gap-1 pointer-events-auto">
            <button
              onClick={() => setShowOrders(true)}
              className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="1" y1="2" x2="23" y2="2"/><line x1="5" y1="2" x2="5" y2="6"/><line x1="19" y1="2" x2="19" y2="6"/><path d="M2 6h20v10H2z"/></svg>
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white">
                  {orders.length}
                </span>
              )}
            </button>
            <span className="text-[10px] font-bold text-blue-700 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap">我的订单</span>
          </div>
        )}
        {user && (
          <div className="flex flex-col items-center gap-1 pointer-events-auto">
            <button
              onClick={() => {
                if (!user) {
                  handleOpenLogin();
                  return;
                }
                setShowNotifications(v => !v);
              }}
              className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-400 to-violet-500 text-white rounded-2xl shadow-xl shadow-violet-500/40 hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {(messagesData.notifications.filter(n => n.unread).length + dynamicChats.filter(c => c.unread).length) > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white">
                  {(messagesData.notifications.filter(n => n.unread).length + dynamicChats.filter(c => c.unread).length) > 9
                    ? '9+'
                    : messagesData.notifications.filter(n => n.unread).length + dynamicChats.filter(c => c.unread).length}
                </span>
              )}
            </button>
            <span className="text-[10px] font-bold text-violet-700 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap">消息</span>
          </div>
        )}
        <FloatingButton
          onClick={() => {
            if (!user) {
              handleOpenLogin();
              return;
            }
            setShowPublish(true);
          }}
        />
      </div>

      {showLogin && (
        <Login
          onLogin={handleUserLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onToast={showToast}
        />
      )}

      {showRegister && (
        <Register
          onLogin={handleUserLogin}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onToast={showToast}
        />
      )}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-eco-600 via-eco-500 to-emerald-500 shadow-eco-500/40'
              : toast.type === 'error'
              ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-rose-500/40'
              : 'bg-gradient-to-r from-slate-700 to-slate-600 shadow-slate-500/40'
          }`}>
            {toast.type === 'success' && <span className="text-lg">✓</span>}
            {toast.type === 'error' && <span className="text-lg">✕</span>}
            {toast.type === 'info' && <span className="text-lg">ℹ</span>}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
