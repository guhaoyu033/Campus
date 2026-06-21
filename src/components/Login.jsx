import { useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Loader2, X, Sparkles } from 'lucide-react';
import { login, validateEmail, validatePassword } from '../store/authStore';

export default function Login({ onLogin, onClose, onSwitchToRegister, onToast }) {
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

  const handleDemoLogin = async (demoEmail = 'xiaoming@campus.edu', demoPassword = '123456') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setTouched({ email: true, password: true });
    setLoading(true);
    setError('');

    try {
      const user = await login(demoEmail, demoPassword);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        {/* 顶部 Logo */}
        <div className="bg-gradient-to-br from-eco-500 via-eco-500 to-emerald-500 px-6 py-8 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white/90 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 mx-auto bg-white/25 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-1">欢迎回来</h1>
          <p className="text-sm text-white/80">登录校园智转，发现闲置好物</p>
        </div>

        {/* 表单区 */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">邮箱地址</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="your@email.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">密码</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${passwordError ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="请输入密码"
                  className={`w-full pl-11 pr-11 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
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

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-eco-600 to-emerald-500 hover:from-eco-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-eco-500/30 hover:shadow-eco-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">快速体验</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* 演示账号快捷登录 */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            <button
              onClick={() => handleDemoLogin('xiaoming@campus.edu', '123456')}
              disabled={loading}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 text-eco-600" />
              🎓 演示账号：小明同学 (清华大学)
            </button>
            <button
              onClick={() => handleDemoLogin('lisa@campus.edu', '123456')}
              disabled={loading}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              🌱 演示账号：环保少女 Lisa (北京大学)
            </button>
            <button
              onClick={() => handleDemoLogin('ajie@campus.edu', '123456')}
              disabled={loading}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 text-blue-600" />
              💻 演示账号：程序员阿杰 (浙江大学)
            </button>
          </div>

          {/* 注册提示 */}
          <p className="text-center text-sm text-slate-500">
            还没有账号？{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-eco-600 font-bold hover:text-eco-700 transition-colors"
            >
              立即注册 →
            </button>
          </p>
        </div>

        {/* 提示条 */}
        <div className="px-6 pb-6">
          <div className="p-3 bg-eco-50 border border-eco-100 rounded-xl">
            <p className="text-xs text-slate-600 text-center">
              <span className="font-semibold text-eco-700">💡 演示账号密码统一为：</span> 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
