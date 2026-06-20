import { useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { login, validateEmail, validatePassword } from '../store/authStore';

export default function Login({ onLogin, onSwitchToRegister, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && !validateEmail(email) ? '请输入有效的邮箱地址' : '';
  const passwordError = touched.password && !validatePassword(password) ? '密码至少需要 6 个字符' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    if (!validateEmail(email) || !validatePassword(password)) {
      setError('请检查并填写正确的账号信息');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('xiaoming@campus.edu');
    setPassword('123456');
    setTouched({ email: true, password: true });
    setLoading(true);
    setError('');
    
    try {
      const user = await login('xiaoming@campus.edu', '123456');
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 mx-auto mb-6 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-lg shadow-eco-500/30 group-hover:shadow-eco-500/50 transition-shadow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </button>
          <h1 className="text-3xl font-black text-slate-900 mb-2">欢迎回来</h1>
          <p className="text-sm text-slate-500">登录校园智转，发现闲置好物</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="your@email.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                    emailError
                      ? 'border-red-200 focus:border-red-400 focus:bg-red-50/30'
                      : 'border-slate-100 focus:border-eco-400 focus:bg-eco-50/50'
                  }`}
                  disabled={loading}
                />
              </div>
              {emailError && <p className="mt-1.5 text-xs text-red-600">{emailError}</p>}
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">密码</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${passwordError ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="请输入密码"
                  className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                    passwordError
                      ? 'border-red-200 focus:border-red-400 focus:bg-red-50/30'
                      : 'border-slate-100 focus:border-eco-400 focus:bg-eco-50/50'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-eco-600 to-emerald-500 hover:from-eco-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-eco-500/30 hover:shadow-eco-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  登录
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* 分割线 */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">或</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* 快速体验 */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 text-eco-600" />
            使用演示账号快速登录
          </button>

          {/* 注册提示 */}
          <p className="mt-6 text-center text-sm text-slate-500">
            还没有账号？{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-eco-600 font-semibold hover:text-eco-700 transition-colors"
            >
              立即注册 →
            </button>
          </p>
        </div>

        {/* 演示账号提示 */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur rounded-2xl border border-eco-100">
          <p className="text-xs text-slate-600 text-center">
            <span className="font-semibold text-eco-700">💡 演示账号：</span> xiaoming@campus.edu / 123456
          </p>
        </div>
      </div>
    </div>
  );
}
