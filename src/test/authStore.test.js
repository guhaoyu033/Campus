import { describe, it, expect, beforeEach } from 'vitest';
import { login, register, logout, getCurrentUser, isLoggedIn, validateEmail, validatePassword, validateName } from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('validateEmail', () => {
    it('应接受合法邮箱', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@university.edu')).toBe(true);
    });

    it('应拒绝非法邮箱', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('应接受 6 位及以上密码', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('abcdef')).toBe(true);
    });

    it('应拒绝 6 位以下密码', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('应接受 2-20 位的名字', () => {
      expect(validateName('张三')).toBe(true);
      expect(validateName('ab')).toBe(true);
    });

    it('应拒绝过短或过长的名字', () => {
      expect(validateName('a')).toBe(false);
      expect(validateName('a'.repeat(21))).toBe(false);
      expect(validateName('')).toBe(false);
    });
  });

  describe('login', () => {
    it('应拒绝未注册的邮箱', async () => {
      await expect(login('nobody@test.com', 'password123')).rejects.toThrow('该邮箱未注册');
    });

    it('登录后应能获取当前用户', async () => {
      // 先注册
      await register({ name: '测试用户', email: 'login@test.com', password: '123456', school: '测试大学' });
      // 再登录
      const user = await login('login@test.com', '123456');
      expect(user.email).toBe('login@test.com');
      expect(getCurrentUser().email).toBe('login@test.com');
      expect(isLoggedIn()).toBe(true);
    });

    it('应拒绝错误密码', async () => {
      await register({ name: '测试用户', email: 'wrongpw@test.com', password: '123456', school: '测试大学' });
      await expect(login('wrongpw@test.com', 'wrongpassword')).rejects.toThrow('密码错误');
    });
  });

  describe('register', () => {
    it('应成功注册新用户', async () => {
      const user = await register({ name: '新用户', email: 'new@test.com', password: '123456', school: '新大学' });
      expect(user.name).toBe('新用户');
      expect(user.email).toBe('new@test.com');
      expect(user.school).toBe('新大学');
      expect(user.id).toBeDefined();
      expect(user.password).toBeUndefined();
      expect(isLoggedIn()).toBe(true);
    });

    it('应拒绝重复注册同一邮箱', async () => {
      await register({ name: '用户1', email: 'dup@test.com', password: '123456', school: '大学' });
      await expect(register({ name: '用户2', email: 'dup@test.com', password: '654321', school: '大学2' }))
        .rejects.toThrow('该邮箱已被注册');
    });
  });

  describe('logout', () => {
    it('登出后应无当前用户', async () => {
      await register({ name: '登出用户', email: 'logout@test.com', password: '123456', school: '大学' });
      expect(isLoggedIn()).toBe(true);
      logout();
      expect(isLoggedIn()).toBe(false);
      expect(getCurrentUser()).toBeNull();
    });
  });
});
