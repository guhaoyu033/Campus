import { useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { register, validateEmail, validatePassword, validateName } from '../store/authStore';

export default function Register({ onRegister, onSwitchToLogin, onBack }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const errors = {
    name: touched.name && !validateName(form.name) ? '昵称长度需在 2-20 个字符之间' : '',
    email: touched.email && !validateEmail(form.email) ? '请输入有效的邮箱地址' : '',
    password: touched.password && !validatePassword(form.password) ? '密码至少需要 6 个字符' : '',
    confirmPassword:
      touched.confirmPassword && form.confirmPassword !== form.password
        ? '两次输入的密码不一致'
        : '',
  };

  const hasErrors = Object.values(errors).some((e) => e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateName(form.name) || !validateEmail(form.email) || !validatePassword(form.password) || form.confirmPassword !== form.password) {
      setError('请检查并修正表单中的错误');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        school: form.school || '未填写学校',
      });
      onRegister(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 mx-auto mb-5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-lg shadow-eco-500/30 group-hover:shadow-eco-500/50 transition-shadow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </button>
          <h1 className="text-3xl font-black text-slate-900 mb-2">创建账号</h1>
          <p className="text-sm text-slate-500">加入校园智转，开启环保校园生活</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 昵称 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">昵称</label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.name ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="你的昵称"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                    errors.name
                      ? 'border-red-200 focus:border-red-400 focus:bg-red-50/30'
                      : 'border-slate-100 focus:border-eco-400 focus:bg-eco-50/50'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="your@email.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                    errors.email
                      ? 'border-red-200 focus:border-red-400 focus:bg-red-50/30'
                      : 'border-slate-100 focus:border-eco-400 focus:bg-eco-50/50'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* 学校 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                所在学校 <span className="text-slate-400 font-normal">（选填）</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={form.school}
                  onChange={(e) => updateField('school', e.target.value)}
                  placeholder="例如：清华大学"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-eco-400 focus:bg-eco-50/50 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">设置密码</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="至少 6 位字符"
                  className={`w-full pl-11 pr-11 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                    errors.password
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
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">确认密码</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="再次输入密码"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                    errors.confirmPassword
                      ? 'border-red-200 focus:border-red-400 focus:bg-red-50/30'
                      : 'border-slate-100 focus:border-eco-400 focus:bg-eco-50/50'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading || hasErrors}
              className="w-full py-3.5 bg-gradient-to-r from-eco-600 to-emerald-500 hover:from-eco-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-eco-500/30 hover:shadow-eco-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  注册账号
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* 注册提示 */}
          <p className="mt-6 text-center text-sm text-slate-500">
            已有账号？{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-eco-600 font-semibold hover:text-eco-700 transition-colors"
            >
              返回登录 →
            </button>
          </p>
        </div>

        {/* 服务条款提示 */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur rounded-2xl border border-eco-100">
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            <CheckCircle className="w-3.5 h-3.5 text-eco-600 inline -mt-0.5 mr-1" />
            注册即表示您同意 <span className="text-slate-700 font-medium">校园智转服务条款</span> 与 <span className="text-slate-700 font-medium">隐私政策</span>
          </p>
        </div>
      </div>
    </div>
  );
}
