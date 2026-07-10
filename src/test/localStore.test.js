import { describe, it, expect, beforeEach } from 'vitest';
import localStore from '../store/localStore';

describe('localStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('用户数据', () => {
    it('应该正确存储和读取用户数据', () => {
      const user = { id: 'u1', name: '张三', email: 'test@test.com' };
      localStore.setUser(user);
      const retrieved = localStore.getUser();
      expect(retrieved).toEqual(user);
    });

    it('无用户数据时应返回 null', () => {
      expect(localStore.getUser()).toBeNull();
    });

    it('清除用户数据后应返回 null', () => {
      localStore.setUser({ id: 'u1' });
      localStore.clearUser();
      expect(localStore.getUser()).toBeNull();
    });
  });

  describe('购物车数据', () => {
    it('空购物车应返回空数组', () => {
      expect(localStore.getCart()).toEqual([]);
    });

    it('应该正确存储购物车数据', () => {
      const cart = [{ productId: 'p1', qty: 2 }];
      localStore.setCart(cart);
      expect(localStore.getCart()).toEqual(cart);
    });
  });

  describe('商品数据', () => {
    it('无存储时应返回 fallback 数据', () => {
      const fallback = [{ id: 'p1', title: '测试商品' }];
      const result = localStore.getProducts(fallback);
      expect(result).toEqual(fallback);
    });

    it('有存储数据时应返回存储的数据', () => {
      const products = [{ id: 'p1', title: '存储的商品' }];
      localStore.setProducts(products);
      expect(localStore.getProducts([])).toEqual(products);
    });
  });

  describe('订单数据', () => {
    it('空订单应返回空数组', () => {
      expect(localStore.getOrders()).toEqual([]);
    });

    it('应该正确存储订单数据', () => {
      const orders = [{ id: 'o1', status: 'pending' }];
      localStore.setOrders(orders);
      expect(localStore.getOrders()).toEqual(orders);
    });
  });

  describe('地址簿数据', () => {
    it('空地址簿应返回空数组', () => {
      expect(localStore.getAddressBook()).toEqual([]);
    });
  });

  describe('浏览历史', () => {
    it('空浏览历史应返回空数组', () => {
      expect(localStore.getViewHistory()).toEqual([]);
    });
  });

  describe('动态聊天', () => {
    it('空动态聊天应返回空数组', () => {
      expect(localStore.getDynamicChats()).toEqual([]);
    });

    it('addDynamicChat 应正确添加聊天', () => {
      const chat = { id: 'chat:1', userId: 'u2', name: '李四' };
      localStore.addDynamicChat(chat);
      const result = localStore.getDynamicChats();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('李四');
    });

    it('addDynamicChat 不应重复添加同一卖家的聊天', () => {
      const chat1 = { id: 'chat:1', userId: 'u2', name: '李四' };
      const chat2 = { id: 'chat:2', userId: 'u2', name: '李四2' };
      localStore.addDynamicChat(chat1);
      localStore.addDynamicChat(chat2);
      expect(localStore.getDynamicChats()).toHaveLength(1);
    });

    it('updateDynamicChat 应正确更新聊天数据', () => {
      const chat = { id: 'chat:1', userId: 'u2', name: '李四', lastMessage: '' };
      localStore.addDynamicChat(chat);
      localStore.updateDynamicChat('chat:1', { lastMessage: '你好', unread: false });
      const result = localStore.getDynamicChats();
      expect(result[0].lastMessage).toBe('你好');
      expect(result[0].unread).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('应清除所有 campusflow_ 前缀的数据', () => {
      localStore.setUser({ id: 'u1' });
      localStore.setCart([{ productId: 'p1', qty: 1 }]);
      // clearAll 遍历 localStorage 删除所有 campusflow_ 前缀的 key
      localStore.clearAll();
      // 验证存储已被清除（通过 key 方法检查）
      const length = window.localStorage.length;
      expect(length).toBe(0);
    });
  });
});
