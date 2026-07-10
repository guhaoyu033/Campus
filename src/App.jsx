import { useState, useMemo, useCallback } from 'react';
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
import ViewHistory from './components/ViewHistory';
import Login from './components/Login';
import Register from './components/Register';
import messagesData from './data/messages.json';
import usersData from './data/users.json';
import { useStore, useProducts, useToast, useCart, useOrders } from './hooks/useStore';
import { useDebounce, useKeyboardShortcut } from './hooks/useUtils';

function App() {
  const { user, setUser, addressBook, setAddressBook, viewHistory, setViewHistory, dynamicChats, setDynamicChats } = useStore();
  const { products, toggleLike, addComment, sellerReply, toggleCommentLike, updateProductStatus, deleteProduct, publishProduct, incrementViews, markAsSold } = useProducts();
  const { toast, showToast } = useToast();
  const { cart, addToCart, updateQty, removeFromCart, clearCart, cartCount } = useCart(products, showToast);
  const { orders, checkout, updateOrderStatus } = useOrders(products, showToast);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showViewHistory, setShowViewHistory] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
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
  }, [products, debouncedSearchTerm, activeCategory, sortBy, priceRange]);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    incrementViews(product.id);
    setViewHistory(prev => {
      const filtered = prev.filter(item => item.id !== product.id);
      return [{ ...product }, ...filtered].slice(0, 20);
    });
  }, [incrementViews, setViewHistory]);

  const handleCheckout = useCallback((items, address) => {
    const newOrders = checkout(items, address);
    newOrders.forEach(o => markAsSold(o.productId));
    clearCart();
  }, [checkout, markAsSold, clearCart]);

  const handlePublish = useCallback((newProduct) => {
    publishProduct(newProduct, user);
    setShowPublish(false);
    showToast('🎉 发布成功！你的闲置商品已上架');
  }, [publishProduct, user, showToast]);

  const handleUserLogin = useCallback((userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowRegister(false);
    setAddressBook([]);
    setSelectedAddressId(null);
    showToast(`欢迎回来，${userData.name || '同学'}！🎉`, 'success');
  }, [setUser, setAddressBook, showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAddressBook([]);
    setSelectedAddressId(null);
    setShowAddressModal(false);
    setSelectedChat(null);
    showToast('已退出登录，再见！👋');
  }, [setUser, setAddressBook, showToast]);

  const handleUpdateUser = useCallback((formData) => {
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
  }, [user, setUser, setAddressBook]);

  const handleAddAddress = useCallback((addr) => {
    if (!addr) return;
    setAddressBook(prev => {
      const isFirst = prev.length === 0;
      const shouldDefault = !!addr.isDefault || isFirst;
      const id = (typeof addr.id === 'string' && addr.id.startsWith('a')) ? addr.id : `a${Date.now()}`;
      const normalized = { ...addr, id, isDefault: shouldDefault };
      let next = [normalized, ...prev];
      if (shouldDefault) {
        next = next.map((a, i) => (i === 0 ? { ...a, isDefault: true } : { ...a, isDefault: false }));
      }
      if (!selectedAddressId) {
        setSelectedAddressId(id);
      }
      return next;
    });
  }, [setAddressBook, selectedAddressId]);

  const handleSaveAddressBook = useCallback((addresses) => {
    if (Array.isArray(addresses)) {
      setAddressBook(addresses);
    }
  }, [setAddressBook]);

  const handleOpenChat = useCallback((chatIdOrOptions) => {
    let chat;
    if (typeof chatIdOrOptions === 'string') {
      chat = dynamicChats.find(c => c.id === chatIdOrOptions);
      if (!chat) chat = messagesData.chats.find(c => c.id === chatIdOrOptions);
    } else {
      const { product, seller } = chatIdOrOptions;
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
        setDynamicChats(prev => {
          if (prev.some(c => c.userId === seller.id)) return prev;
          return [...prev, chat];
        });
      }
    }
    if (chat) {
      setSelectedChat(chat);
    }
  }, [dynamicChats, user, setDynamicChats]);

  const handleUpdateChat = useCallback((chatId, updates) => {
    setDynamicChats(prev => prev.map(c => c.id === chatId ? { ...c, ...updates } : c));
  }, [setDynamicChats]);

  useKeyboardShortcut('k', () => {
    const searchInput = document.querySelector('input[placeholder*="搜索"]');
    searchInput?.focus();
  }, !showLogin && !showRegister && !selectedProduct);

  useKeyboardShortcut('n', () => {
    if (user) setShowNotifications(v => !v);
  }, user);

  useKeyboardShortcut('p', () => {
    if (user) setShowProfile(true);
  }, user);

  useKeyboardShortcut('Escape', () => {
    if (selectedProduct) setSelectedProduct(null);
    else if (showNotifications) setShowNotifications(false);
    else if (showDashboard) setShowDashboard(false);
    else if (showPublish) setShowPublish(false);
    else if (showMyListings) setShowMyListings(false);
    else if (showMyFavorites) setShowMyFavorites(false);
    else if (showProfile) setShowProfile(false);
    else if (showCart) setShowCart(false);
    else if (showOrders) setShowOrders(false);
    else if (showViewHistory) setShowViewHistory(false);
    else if (selectedChat) setSelectedChat(null);
    else if (showLogin) setShowLogin(false);
    else if (showRegister) setShowRegister(false);
  });

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
        onOpenViewHistory={() => setShowViewHistory(true)}
        cartCount={cartCount}
        ordersCount={orders.length}
        user={user}
        onLogin={() => { setShowLogin(true); setShowRegister(false); }}
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
                <span>实时智能匹配中</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">发现校园闲置好物</h1>
              <p className="text-sm text-white/80 mb-6 max-w-lg">
                基于你的浏览偏好，为你推荐最适合的校园二手商品，让闲置流转起来
              </p>
              <SearchBar value={searchTerm} onChange={setSearchTerm} products={products} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">筛选</span>
              <span className="w-12 h-px bg-slate-200" />
            </div>
            <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">排序</span>
            <span className="w-8 h-px bg-slate-200 shrink-0" />
            {quickFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSortBy(filter.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  sortBy === filter.key
                    ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-lg shadow-eco-500/30'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-eco-300 hover:text-eco-700'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 animate-slide-up">
          <ProductGrid products={filteredProducts} onSelect={handleSelectProduct} onToggleLike={toggleLike} />

          {filteredProducts.length === 0 && (
            <div className="space-y-6">
              <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">暂无匹配物品</h3>
                <p className="text-sm text-slate-500 mb-5">试试其他关键词或价格范围，或者看看校园热门推荐</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                      setPriceRange({ min: '', max: '' });
                    }}
                    className="px-4 py-2.5 bg-eco-600 text-white rounded-xl font-semibold text-sm hover:bg-eco-700 transition-all"
                  >
                    清除筛选
                  </button>
                  <button
                    onClick={() => setShowPublish(true)}
                    className="px-4 py-2.5 bg-white border-2 border-eco-300 text-eco-700 rounded-xl font-semibold text-sm hover:bg-eco-50 transition-all"
                  >
                    + 发布闲置
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-5 bg-gradient-to-b from-eco-500 to-eco-700 rounded-full" />
                  <h3 className="font-bold text-slate-900">🔥 校园热门推荐</h3>
                </div>
                <ProductGrid products={products.filter(p => p.status === 'active').sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6)} onSelect={handleSelectProduct} onToggleLike={toggleLike} />
              </div>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-5 border border-blue-100">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-bold text-slate-900">教材专区</div>
              <div className="text-xs text-slate-500 mt-1">考研、四六级、专业课本</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
              <div className="text-3xl mb-2">💻</div>
              <div className="font-bold text-slate-900">数码好物</div>
              <div className="text-xs text-slate-500 mt-1">手机、电脑、配件周边</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
              <div className="text-3xl mb-2">👕</div>
              <div className="font-bold text-slate-900">服饰鞋包</div>
              <div className="text-xs text-slate-500 mt-1">潮流穿搭、运动装备</div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-6 left-0 right-0 z-30 flex items-end justify-center sm:justify-end px-4 sm:px-6 gap-3 pointer-events-none">
        {user && (
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="pointer-events-auto relative flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md text-slate-700 rounded-2xl shadow-xl shadow-slate-500/20 hover:shadow-2xl hover:scale-105 hover:bg-white transition-all border border-white/50"
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {(() => {
                const staticUnread = messagesData.chats.filter(c => c.unread).length;
                const dynamicUnread = dynamicChats.filter(c => c.unread).length;
                const notificationUnread = messagesData.notifications.filter(n => n.unread).length;
                const unread = notificationUnread + staticUnread + dynamicUnread;
                return unread > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unread > 9 ? '9+' : unread}
                  </span>
                ) : null;
              })()}
            </div>
            <span className="text-sm font-semibold hidden sm:inline">消息</span>
          </button>
        )}

        <FloatingButton
          onClick={() => {
            if (!user) { setShowLogin(true); return; }
            setShowPublish(true);
          }}
        />
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          user={user}
          onClose={() => setSelectedProduct(null)}
          onToggleLike={toggleLike}
          onAddToCart={addToCart}
          onAddComment={addComment}
          onSellerReply={sellerReply}
          onToggleCommentLike={toggleCommentLike}
          onOpenChat={() => {
            const seller = usersData.find(u => u.id === selectedProduct.sellerId);
            handleOpenChat({ product: selectedProduct, seller });
          }}
          onToast={showToast}
          relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 6)}
        />
      )}

      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}

      {showPublish && (
        <PublishModal
          user={user}
          onClose={() => setShowPublish(false)}
          onPublish={handlePublish}
          onToast={showToast}
        />
      )}

      {showMyListings && (
        <MyListings
          products={products}
          user={user}
          onClose={() => setShowMyListings(false)}
          onUpdateStatus={updateProductStatus}
          onDelete={deleteProduct}
          onSelectProduct={handleSelectProduct}
          onToast={showToast}
        />
      )}

      {showMyFavorites && (
        <MyFavorites
          products={products}
          user={user}
          onClose={() => setShowMyFavorites(false)}
          onToggleLike={toggleLike}
          onSelectProduct={handleSelectProduct}
          onAddToCart={addToCart}
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
          onUpdateUser={handleUpdateUser}
          onSaveAddressBook={handleSaveAddressBook}
          onToast={showToast}
          onOpenOrders={() => { setShowProfile(false); setShowOrders(true); }}
        />
      )}

      {showCart && (
        <CartPage
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onClear={clearCart}
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

      {showViewHistory && (
        <ViewHistory
          history={viewHistory}
          onClose={() => setShowViewHistory(false)}
          onSelectProduct={handleSelectProduct}
          onAddToCart={addToCart}
          onToggleLike={toggleLike}
          onToast={showToast}
        />
      )}

      {showOrders && (
        <OrdersPage
          orders={orders}
          products={products}
          onClose={() => setShowOrders(false)}
          onUpdateStatus={updateOrderStatus}
          onToast={showToast}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {selectedChat && (
        <ChatPanel
          chat={selectedChat}
          user={user}
          onClose={() => setSelectedChat(null)}
          onUpdateChat={handleUpdateChat}
          onToast={showToast}
        />
      )}

      {showLogin && (
        <Login
          onLogin={handleUserLogin}
          onClose={() => setShowLogin(false)}
          onRegister={() => { setShowLogin(false); setShowRegister(true); }}
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

      {user && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-35 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-2 shadow-2xl">
          <div className="flex items-center justify-around">
            <button onClick={() => setShowDashboard(true)} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-eco-50 text-slate-600 hover:text-eco-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="text-[10px] font-semibold">数据</span>
            </button>
            <button onClick={() => setShowMyListings(true)} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-eco-50 text-slate-600 hover:text-eco-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span className="text-[10px] font-semibold">发布</span>
            </button>
            <button onClick={() => setShowMyFavorites(true)} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-eco-50 text-slate-600 hover:text-eco-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span className="text-[10px] font-semibold">收藏</span>
            </button>
            <button onClick={() => setShowCart(true)} className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-eco-50 text-slate-600 hover:text-eco-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="text-[10px] font-semibold">购物车</span>
              {cartCount > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{cartCount > 9 ? '9+' : cartCount}</span>}
            </button>
            <button onClick={() => setShowProfile(true)} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-eco-50 text-slate-600 hover:text-eco-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-[10px] font-semibold">我的</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
