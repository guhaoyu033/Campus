// 用户认证状态管理
// 使用 localStorage 实现 session 持久化

const STORAGE_KEY = 'campusflow_auth';
const USERS_KEY = 'campusflow_registered_users';

// 从本地存储获取已注册用户列表（初始数据来自 users.json）
import initialUsers from '../data/users.json';

function getRegisteredUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...initialUsers];
    }
  }
  return [...initialUsers];
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 获取当前登录用户
export function getCurrentUser() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// 登录
export function login(email, password) {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      const users = getRegisteredUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      
      if (!user) {
        reject(new Error('该邮箱未注册，请先注册账号'));
        return;
      }
      
      if (user.password !== password) {
        reject(new Error('密码错误，请重新输入'));
        return;
      }
      
      // 登录成功，保存 session（不保存密码）
      const { password: _pwd, ...userWithoutPassword } = user;
      const sessionData = {
        ...userWithoutPassword,
        loginTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      resolve(sessionData);
    }, 600);
  });
}

// 注册
export function register({ name, email, password, school }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getRegisteredUsers();
      
      // 检查邮箱是否已存在
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      
      if (exists) {
        reject(new Error('该邮箱已被注册，请直接登录'));
        return;
      }
      
      // 创建新用户
      const newUser = {
        id: `u_${Date.now()}`,
        email: email.trim(),
        password: password,
        name: name.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        school: school || '未填写学校',
        creditScore: 80 + Math.floor(Math.random() * 15),
        tradeCount: 0,
        tags: ['新用户'],
        joinedAt: new Date().toISOString().split('T')[0],
      };
      
      users.push(newUser);
      saveRegisteredUsers(users);
      
      // 自动登录
      const { password: _pwd, ...userWithoutPassword } = newUser;
      const sessionData = {
        ...userWithoutPassword,
        loginTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      resolve(sessionData);
    }, 600);
  });
}

// 登出
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

// 检查是否已登录
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

// 更新用户信息
export function updateUser(updates) {
  const current = getCurrentUser();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // 同步更新注册用户列表
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    saveRegisteredUsers(users);
  }
  
  return updated;
}

// 表单校验工具
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

export function validateName(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 20;
}
