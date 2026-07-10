/**
 * 全局状态管理 Context
 *
 * 将原有的 useStore / useProducts / useCart / useOrders / useToast 整合为单一 Provider，
 * 消除各 hook 独立初始化 localStorage 导致的状态不一致问题。
 * 所有状态在 Provider 层统一管理，组件通过 useAppContext 消费。
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import localStore from '../store/localStore';
import productsData from '../data/products.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ===== 核心状态（统一初始化，避免重复读取 localStorage） =====
  const [user, setUser] = useState(() => localStore.getUser());
  const [products, setProducts] = useState(() =>
    localStore.getProducts(productsData.map(p => ({ ...p, status: p.status || 'active' })))
  );
  const [cart, setCart] = useState(() => localStore.getCart());
  const [orders, setOrders] = useState(() => localStore.getOrders());
  const [addressBook, setAddressBook] = useState(() => localStore.getAddressBook());
  const [viewHistory, setViewHistory] = useState(() => localStore.getViewHistory());
  const [dynamicChats, setDynamicChats] = useState(() => localStore.getDynamicChats());
  const [toast, setToastState] = useState(null);

  const toastTimerRef = useRef(null);

  // ===== 持久化同步 =====
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

  // ===== Toast =====
  const showToast = useCallback((message, type = 'success') => {
    setToastState({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastState(null), 2500);
  }, []);

  // ===== 商品操作 =====
  const toggleLike = useCallback((productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, liked: !p.liked, likes: p.liked ? (p.likes || 0) - 1 : (p.likes || 0) + 1 };
      }
      return p;
    }));
  }, []);

  const addComment = useCallback((productId, comment) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, comments: [comment, ...(p.comments || [])] };
      }
      return p;
    }));
  }, []);

  const sellerReply = useCallback((productId, commentId, replyText) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedComments = (p.comments || []).map(c =>
          c.id === commentId ? { ...c, sellerReply: replyText } : c
        );
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
  }, []);

  const toggleCommentLike = useCallback((productId, commentId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedComments = (p.comments || []).map(c => {
          if (c.id === commentId) {
            return { ...c, liked: !c.liked, likes: c.liked ? (c.likes || 0) - 1 : (c.likes || 0) + 1 };
          }
          return c;
        });
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
  }, []);

  const updateProductStatus = useCallback((productId, newStatus) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const publishProduct = useCallback((newProduct, currentUser) => {
    const product = {
      ...newProduct,
      id: `p${Date.now()}`,
      price: parseFloat(newProduct.price) || 0,
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : (parseFloat(newProduct.price) * 2),
      liked: false,
      status: 'active',
      matchScore: 80 + Math.floor(Math.random() * 15),
      matchFactor: '基于新鲜度推荐',
      sellerId: currentUser ? currentUser.id : 'u1',
      location: newProduct.location || (currentUser?.school || '我的学校'),
      views: 0,
      likes: 0,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [product, ...prev]);
    return product;
  }, []);

  const incrementViews = useCallback((productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p));
  }, []);

  const markAsSold = useCallback((productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'sold', stock: 0 } : p));
  }, []);

  // ===== 购物车操作 =====
  const addToCart = useCallback((productId, qty = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { productId, qty, addedAt: new Date().toISOString() }];
    });
    showToast(`已加入购物车：${product.title} 🛒`, 'success');
  }, [products, showToast]);

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i));
    }
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ===== 订单操作 =====
  const checkout = useCallback((items, address) => {
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
    showToast(`下单成功！共 ${newOrders.length} 件商品 🎉`, 'success');
    return newOrders;
  }, [products, showToast]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast('订单状态已更新 ✅');
  }, [showToast]);

  // ===== 计算属性 =====
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.qty;
    }, 0);
  }, [cart, products]);

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  // ===== 用户操作 =====
  const handleUserLogin = useCallback((userData) => {
    setUser(userData);
    setAddressBook([]);
    showToast(`欢迎回来，${userData.name || '同学'}！🎉`, 'success');
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAddressBook([]);
    showToast('已退出登录，再见！👋');
  }, [showToast]);

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
  }, [user]);

  const value = useMemo(() => ({
    // 状态
    user, products, cart, orders, addressBook, viewHistory, dynamicChats, toast,
    // 状态 setter
    setUser, setAddressBook, setViewHistory, setDynamicChats,
    // 商品操作
    toggleLike, addComment, sellerReply, toggleCommentLike, updateProductStatus,
    deleteProduct, publishProduct, incrementViews, markAsSold,
    // 购物车操作
    addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount,
    // 订单操作
    checkout, updateOrderStatus,
    // 用户操作
    handleUserLogin, handleLogout, handleUpdateUser,
    // Toast
    showToast,
  }), [
    user, products, cart, orders, addressBook, viewHistory, dynamicChats, toast,
    setUser, setAddressBook, setViewHistory, setDynamicChats,
    toggleLike, addComment, sellerReply, toggleCommentLike, updateProductStatus,
    deleteProduct, publishProduct, incrementViews, markAsSold,
    addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount,
    checkout, updateOrderStatus,
    handleUserLogin, handleLogout, handleUpdateUser,
    showToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp 必须在 AppProvider 内使用');
  return ctx;
}
