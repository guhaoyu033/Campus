const PREFIX = 'campusflow_';
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 天

const safeGet = (key) => {
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

  clearAll: () => {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  }
};
