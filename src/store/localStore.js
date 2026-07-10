const PREFIX = 'campusflow_';
const TTL = 90 * 24 * 60 * 60 * 1000;

const storageAvailable = (() => {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
})();

const safeGet = (key) => {
  if (!storageAvailable) return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && '_v' in parsed && '_t' in parsed) {
      if (Date.now() - parsed._t > TTL) {
        window.localStorage.removeItem(PREFIX + key);
        return null;
      }
      return parsed._v;
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

const safeSet = (key, value) => {
  if (!storageAvailable) return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(PREFIX + key);
      return;
    }
    window.localStorage.setItem(
      PREFIX + key,
      JSON.stringify({ _v: value, _t: Date.now() })
    );
  } catch (e) {
    // 忽略配额超限等错误
  }
};

const safeRemove = (key) => {
  if (!storageAvailable) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch (e) {
    // noop
  }
};

export default {
  getUser: () => safeGet('user'),
  setUser: (user) => safeSet('user', user),
  clearUser: () => safeRemove('user'),

  getProducts: (fallback) => {
    const v = safeGet('products');
    return Array.isArray(v) && v.length > 0 ? v : fallback;
  },
  setProducts: (list) => safeSet('products', list),

  getCart: () => {
    const v = safeGet('cart');
    return Array.isArray(v) ? v : [];
  },
  setCart: (list) => safeSet('cart', list),

  getOrders: () => {
    const v = safeGet('orders');
    return Array.isArray(v) ? v : [];
  },
  setOrders: (list) => safeSet('orders', list),

  getAddressBook: () => {
    const v = safeGet('addressBook');
    return Array.isArray(v) ? v : [];
  },
  setAddressBook: (list) => safeSet('addressBook', list),

  getViewHistory: () => {
    const v = safeGet('viewHistory');
    return Array.isArray(v) ? v : [];
  },
  setViewHistory: (list) => safeSet('viewHistory', list),

  // 动态创建的聊天会话（从商品详情页发起的私信）
  getDynamicChats: () => {
    const v = safeGet('dynamicChats');
    return Array.isArray(v) ? v : [];
  },
  addDynamicChat: (chat) => {
    const existing = safeGet('dynamicChats') || [];
    // 避免重复添加同一卖家
    if (existing.some(c => c.userId === chat.userId)) return;
    safeSet('dynamicChats', [...existing, chat]);
  },
  updateDynamicChat: (chatId, updates) => {
    const existing = safeGet('dynamicChats') || [];
    const updated = existing.map(c => c.id === chatId ? { ...c, ...updates } : c);
    safeSet('dynamicChats', updated);
  },

  clearAll: () => {
    if (!storageAvailable) return;
    try {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(PREFIX)) keysToRemove.push(key);
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch (e) {
      // noop
    }
  }
};
