/**
 * API 服务抽象层
 *
 * 当前实现基于 localStorage 模拟后端接口（Mock 模式）。
 * 未来接入真实后端时，只需将各方法实现替换为 fetch/axios 调用即可，
 * 组件层代码无需任何修改。
 *
 * 示例（接入真实后端）：
 *   getProducts: () => fetch('/api/products').then(r => r.json()),
 *   toggleLike: (id) => fetch(`/api/products/${id}/like`, { method: 'POST' }).then(r => r.json()),
 */

import localStore from '../store/localStore';
import authStore from '../store/authStore';
import productsData from '../data/products.json';
import messagesData from '../data/messages.json';

// 模拟网络延迟
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // ==================== 商品 ====================
  async getProducts() {
    await delay();
    return localStore.getProducts(productsData.map(p => ({ ...p, status: p.status || 'active' })));
  },

  async updateProducts(products) {
    localStore.setProducts(products);
    return products;
  },

  // ==================== 用户认证 ====================
  async login(email, password) {
    return authStore.login(email, password);
  },

  async register(data) {
    return authStore.register(data);
  },

  async logout() {
    authStore.logout();
  },

  getCurrentUser() {
    return authStore.getCurrentUser();
  },

  updateUser(updates) {
    return authStore.updateUser(updates);
  },

  // ==================== 购物车 ====================
  async getCart() {
    await delay(100);
    return localStore.getCart();
  },

  async saveCart(cart) {
    localStore.setCart(cart);
    return cart;
  },

  // ==================== 订单 ====================
  async getOrders() {
    await delay(100);
    return localStore.getOrders();
  },

  async saveOrders(orders) {
    localStore.setOrders(orders);
    return orders;
  },

  // ==================== 地址簿 ====================
  async getAddressBook() {
    await delay(100);
    return localStore.getAddressBook();
  },

  async saveAddressBook(addresses) {
    localStore.setAddressBook(addresses);
    return addresses;
  },

  // ==================== 浏览历史 ====================
  async getViewHistory() {
    await delay(100);
    return localStore.getViewHistory();
  },

  async saveViewHistory(history) {
    localStore.setViewHistory(history);
    return history;
  },

  // ==================== 聊天 ====================
  async getDynamicChats() {
    await delay(100);
    return localStore.getDynamicChats();
  },

  async saveDynamicChats(chats) {
    localStore.setDynamicChats(chats);
    return chats;
  },

  // ==================== 消息数据 ====================
  getMessages() {
    return messagesData;
  },

  // ==================== 工具 ====================
  clearAll() {
    localStore.clearAll();
  },
};

export default api;
