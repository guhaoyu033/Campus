import { useState, useEffect, useMemo } from 'react';
import localStore from '../store/localStore';
import productsData from '../data/products.json';

export function useStore() {
  const [user, setUser] = useState(() => localStore.getUser());
  const [addressBook, setAddressBook] = useState(() => localStore.getAddressBook());
  const [cart, setCart] = useState(() => localStore.getCart());
  const [orders, setOrders] = useState(() => localStore.getOrders());
  const [viewHistory, setViewHistory] = useState(() => localStore.getViewHistory());
  const [dynamicChats, setDynamicChats] = useState(() => localStore.getDynamicChats());

  useEffect(() => localStore.setUser(user), [user]);
  useEffect(() => localStore.setAddressBook(addressBook), [addressBook]);
  useEffect(() => localStore.setCart(cart), [cart]);
  useEffect(() => localStore.setOrders(orders), [orders]);
  useEffect(() => localStore.setViewHistory(viewHistory), [viewHistory]);
  useEffect(() => {
    const ids = dynamicChats.map(c => c.id);
    const stored = localStore.getDynamicChats().map(c => c.id);
    if (JSON.stringify(ids) !== JSON.stringify(stored)) {
      localStore.setDynamicChats(dynamicChats);
    }
  }, [dynamicChats]);

  return {
    user, setUser,
    addressBook, setAddressBook,
    cart, setCart,
    orders, setOrders,
    viewHistory, setViewHistory,
    dynamicChats, setDynamicChats,
  };
}

export function useProducts() {
  const [products, setProducts] = useState(() =>
    localStore.getProducts(productsData.map(p => ({ ...p, status: p.status || 'active' })))
  );

  useEffect(() => localStore.setProducts(products), [products]);

  const toggleLike = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, liked: !p.liked, likes: p.liked ? (p.likes || 0) - 1 : (p.likes || 0) + 1 };
      }
      return p;
    }));
  };

  const addComment = (productId, comment) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, comments: [comment, ...(p.comments || [])] };
      }
      return p;
    }));
  };

  const sellerReply = (productId, commentId, replyText) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedComments = (p.comments || []).map(c =>
          c.id === commentId ? { ...c, sellerReply: replyText } : c
        );
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
  };

  const toggleCommentLike = (productId, commentId) => {
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
  };

  const updateProductStatus = (productId, newStatus) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const publishProduct = (newProduct, user) => {
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
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const incrementViews = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p));
  };

  const markAsSold = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'sold', stock: 0 } : p));
  };

  return {
    products,
    toggleLike,
    addComment,
    sellerReply,
    toggleCommentLike,
    updateProductStatus,
    deleteProduct,
    publishProduct,
    incrementViews,
    markAsSold,
  };
}

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return { toast, showToast };
}

export function useCart(products, showToast) {
  const [cart, setCart] = useState(() => localStore.getCart());

  useEffect(() => localStore.setCart(cart), [cart]);

  const addToCart = (productId, qty = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { productId, qty, addedAt: new Date().toISOString() }];
    });
    showToast && showToast(`已加入购物车：${product.title} 🛒`, 'success');
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i));
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.qty;
    }, 0);
  }, [cart, products]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };
}

export function useOrders(products, showToast) {
  const [orders, setOrders] = useState(() => localStore.getOrders());

  useEffect(() => localStore.setOrders(orders), [orders]);

  const checkout = (items, address) => {
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
    showToast && showToast(`下单成功！共 ${newOrders.length} 件商品 🎉`, 'success');
    return newOrders;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast && showToast('订单状态已更新 ✅');
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    showToast && showToast('订单已取消');
  };

  return {
    orders,
    checkout,
    updateOrderStatus,
    cancelOrder,
  };
}
