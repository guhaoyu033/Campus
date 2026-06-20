import { useState, useRef, useEffect } from 'react';
import {
  X, User, Mail, GraduationCap, Award, TrendingUp, Camera, Phone, MessageCircle,
  Building2, Calendar, Edit2, Check, Shield, Plus, Trash2, MapPin, Star,
  ChevronDown, Image as ImageIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Eco&backgroundColor=c7f9cc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Campus&backgroundColor=a7f3d0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Green&backgroundColor=bbf7d0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leaf&backgroundColor=d1fae5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Forest&backgroundColor=dcfce7'
];

const ENROLL_YEARS = ['2021', '2022', '2023', '2024'];
const GENDER_OPTIONS = [
  { value: 'male', label: '男', emoji: '👨' },
  { value: 'female', label: '女', emoji: '👩' },
  { value: 'secret', label: '保密', emoji: '🔒' }
];

export default function UserProfile({
  user, products, orders = [], cart = [], viewHistory = [],
  onClose, onLogin, onToast, onUpdateUser, onSaveAddressBook,
  onOpenListings, onOpenFavorites, onOpenOrders
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddressEditor, setShowAddressEditor] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
    bio: user?.bio || '一个热爱校园生活的学生，积极倡导循环经济。',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    wechat: user?.wechat || '',
    gender: user?.gender || 'secret',
    department: user?.department || '',
    enrollYear: user?.enrollYear || ''
  });

  const [addresses, setAddresses] = useState(
    Array.isArray(user?.addresses) ? user.addresses : []
  );

  const [addressDraft, setAddressDraft] = useState({
    name: '', phone: '', province: '', city: '', district: '',
    detail: '', isDefault: false
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setShowAvatarPicker(false);
    }
  }, [isEditing]);

  if (!user) {
    return (
      <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto animate-fade-in">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-slate-900 text-lg">个人中心</h2>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
            <div className="text-7xl mb-5">👋</div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">欢迎来到校园智转</h3>
            <p className="text-sm text-slate-500 mb-6">登录后即可发布商品、收藏好物、查看消息和个人数据</p>
            <button onClick={() => { onClose(); onLogin(); }} className="px-6 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/20 hover:shadow-xl hover:scale-105 transition-all">
              立即登录 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myProducts = products.filter(p => p.sellerId === user.id || p.sellerId === 'u1' || p.sellerId === 'u2');
  const myFavorites = products.filter(p => p.liked);
  const soldCount = myProducts.filter(p => p.status === 'sold').length;
  const creditScore = user.creditScore || 92;

  const displayAvatar = formData.avatar || user.avatar || '';
  const avatarInitial = (formData.name || user.name || 'U').charAt(0).toUpperCase();

  const handleAvatarFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onToast && onToast('请选择图片文件', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData({ ...formData, avatar: ev.target.result });
      setShowAvatarPicker(false);
      onToast && onToast('头像已更换，保存后生效', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handlePickPresetAvatar = (url) => {
    setFormData({ ...formData, avatar: url });
    setShowAvatarPicker(false);
    onToast && onToast('已选择预设头像', 'success');
  };

  const handleClearAvatar = () => {
    setFormData({ ...formData, avatar: '' });
    setShowAvatarPicker(false);
  };

  const handleSave = () => {
    const toSave = { ...formData, addresses };
    if (onUpdateUser) onUpdateUser(toSave);
    if (onSaveAddressBook) onSaveAddressBook(addresses);
    setIsEditing(false);
    setShowAvatarPicker(false);
    onToast && onToast('个人信息已更新 ✅', 'success');
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      school: user?.school || '',
      bio: user?.bio || '一个热爱校园生活的学生，积极倡导循环经济。',
      avatar: user?.avatar || '',
      phone: user?.phone || '',
      wechat: user?.wechat || '',
      gender: user?.gender || 'secret',
      department: user?.department || '',
      enrollYear: user?.enrollYear || ''
    });
    setAddresses(Array.isArray(user?.addresses) ? user.addresses : []);
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const openNewAddress = () => {
    setAddressDraft({
      name: '', phone: '', province: '', city: '', district: '',
      detail: '', isDefault: addresses.length === 0
    });
    setEditingAddressIndex(-1);
    setShowAddressEditor(true);
  };

  const openEditAddress = (idx) => {
    const addr = addresses[idx];
    setAddressDraft({ ...addr });
    setEditingAddressIndex(idx);
    setShowAddressEditor(true);
  };

  const handleSaveAddress = () => {
    if (!addressDraft.name.trim()) { onToast && onToast('请填写收货人', 'error'); return; }
    if (!addressDraft.phone.trim()) { onToast && onToast('请填写联系电话', 'error'); return; }
    if (!addressDraft.detail.trim()) { onToast && onToast('请填写详细地址', 'error'); return; }

    let next = [...addresses];
    if (addressDraft.isDefault) {
      next = next.map(a => ({ ...a, isDefault: false }));
    }
    if (editingAddressIndex >= 0) {
      next[editingAddressIndex] = { ...addressDraft };
    } else {
      next.push({ ...addressDraft });
    }
    if (next.length === 1) {
      next[0] = { ...next[0], isDefault: true };
    }
    setAddresses(next);
    setShowAddressEditor(false);
    onToast && onToast('地址已保存', 'success');
  };

  const handleDeleteAddress = (idx) => {
    const next = addresses.filter((_, i) => i !== idx);
    const wasDefault = addresses[idx].isDefault;
    if (wasDefault && next.length > 0) {
      next[0] = { ...next[0], isDefault: true };
    }
    setAddresses(next);
    onToast && onToast('地址已删除', 'success');
  };

  const handleSetDefaultAddress = (idx) => {
    const next = addresses.map((a, i) => ({ ...a, isDefault: i === idx }));
    setAddresses(next);
    onToast && onToast('已设为默认地址', 'success');
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">个人中心</h2>
              <p className="text-xs text-slate-500">管理你的账户信息</p>
            </div>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-2 bg-eco-50 hover:bg-eco-100 text-eco-700 rounded-xl text-xs font-semibold transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> 编辑资料
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleCancelEdit} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors">
                取消
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
                <Check className="w-3.5 h-3.5" /> 保存修改
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Banner */}
        <div className="bg-gradient-to-br from-eco-500 via-emerald-500 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-5">
            <div className="relative flex-shrink-0">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl sm:text-5xl font-bold border-4 border-white/30">
                  {avatarInitial}
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => setShowAvatarPicker(v => !v)}
                  className="absolute -bottom-1 -right-1 w-9 h-9 bg-white text-eco-600 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                  title="更换头像"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 text-lg font-bold outline-none focus:bg-white/30 transition-all"
                    placeholder="昵称"
                  />
                </div>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-black mb-1 truncate">{formData.name}</h2>
              )}
              <p className="text-sm text-white/80 mb-2 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {formData.email}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {formData.school && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" /> {formData.school}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400/30 border border-amber-300/30 rounded-lg text-xs font-bold">
                  <Award className="w-3.5 h-3.5" /> 信用 A+
                </span>
              </div>
            </div>
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div className="relative mt-5 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold">更换头像</h4>
                <button onClick={() => setShowAvatarPicker(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePickPresetAvatar(url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${formData.avatar === url ? 'border-white shadow-lg' : 'border-white/30'}`}
                  >
                    <img src={url} alt={`preset-${idx}`} className="w-full h-full object-cover bg-white" />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white text-eco-700 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> 从本地选择
                </button>
                <button
                  onClick={handleClearAvatar}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/20 text-white rounded-xl text-xs font-semibold hover:bg-white/30 transition-all"
                >
                  使用首字母
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button onClick={onOpenListings} className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-br from-eco-50 to-white border-eco-200 text-eco-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="text-2xl mb-1">📦</div>
            <div className="text-2xl sm:text-3xl font-black mb-0.5">{myProducts.length}</div>
            <div className="text-xs font-semibold opacity-80">发布商品</div>
          </button>
          <button onClick={onOpenFavorites} className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-br from-rose-50 to-white border-rose-200 text-rose-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="text-2xl mb-1">❤️</div>
            <div className="text-2xl sm:text-3xl font-black mb-0.5">{myFavorites.length}</div>
            <div className="text-xs font-semibold opacity-80">收藏商品</div>
          </button>
          <button onClick={onOpenOrders} className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-br from-blue-50 to-white border-blue-200 text-blue-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="text-2xl mb-1">🛒</div>
            <div className="text-2xl sm:text-3xl font-black mb-0.5">{orders.length}</div>
            <div className="text-xs font-semibold opacity-80">订单数量</div>
          </button>
          <button onClick={onOpenOrders} className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-br from-amber-50 to-white border-amber-200 text-amber-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="text-2xl mb-1">🎉</div>
            <div className="text-2xl sm:text-3xl font-black mb-0.5">{soldCount}</div>
            <div className="text-xs font-semibold opacity-80">已成交</div>
          </button>
        </div>

        {/* Credit + Trading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-eco-600" /> 信用评分体系</h3>
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-black text-eco-600">{creditScore}</span>
                <span className="text-lg font-bold text-slate-600">分</span>
                <span className="ml-auto px-3 py-1.5 bg-eco-100 text-eco-700 rounded-lg text-sm font-bold">A+ 优秀</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-eco-400 to-eco-600 rounded-full transition-all" style={{ width: `${creditScore}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>0</span><span>50</span><span>100</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <CreditItem label="实名已认证" score="+10" positive={true} />
              <CreditItem label="邮箱已验证" score="+5" positive={true} />
              <CreditItem label={`完成交易 ${orders.length} 笔`} score={`+${orders.length * 2}`} positive={true} />
              <CreditItem label={`发布商品 ${myProducts.length} 件`} score={`+${myProducts.length}`} positive={true} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> 交易活跃度</h3>
            <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
              <p className="font-semibold text-slate-700 mb-1">💡 活跃度提升建议</p>
              <p>• 发布更多优质闲置商品</p>
              <p>• 及时回复买家消息和咨询</p>
              <p>• 完成交易后获取买家好评</p>
            </div>
          </div>
        </div>

        {/* Profile Edit / View */}
        {isEditing ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Edit2 className="w-5 h-5 text-eco-600" /> 编辑个人资料</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="昵称" icon={<User className="w-4 h-4" />} value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="输入你的昵称" />
              <FieldInput label="所在学校" icon={<GraduationCap className="w-4 h-4" />} value={formData.school} onChange={(v) => setFormData({ ...formData, school: v })} placeholder="输入你的学校" />
              <FieldInput label="联系邮箱" icon={<Mail className="w-4 h-4" />} value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="输入联系邮箱" type="email" />
              <FieldInput label="手机号" icon={<Phone className="w-4 h-4" />} value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="输入手机号" type="tel" />
              <FieldInput label="微信号 / 联系方式" icon={<MessageCircle className="w-4 h-4" />} value={formData.wechat} onChange={(v) => setFormData({ ...formData, wechat: v })} placeholder="微信号或其他联系方式" />
              <FieldInput label="所在院系 / 专业" icon={<Building2 className="w-4 h-4" />} value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} placeholder="例如：计算机学院 / 软件工程" />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">性别</label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: opt.value })}
                      className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${formData.gender === opt.value ? 'border-eco-500 bg-eco-50 text-eco-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className="mr-1">{opt.emoji}</span>{opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">入学年份</label>
                <div className="relative">
                  <select
                    value={formData.enrollYear}
                    onChange={(e) => setFormData({ ...formData, enrollYear: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-eco-400 focus:ring-4 focus:ring-eco-100/50 outline-none transition-all appearance-none pr-10"
                  >
                    <option value="">请选择入学年份</option>
                    {ENROLL_YEARS.map(y => (
                      <option key={y} value={y}>{y} 级</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">个人简介</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-eco-400 focus:ring-4 focus:ring-eco-100/50 outline-none transition-all resize-none"
                  placeholder="简单介绍一下自己..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-eco-600" /> 个人简介</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{formData.bio}</p>
            <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 pt-3 border-t border-slate-100">
              {formData.school && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-eco-600" /> {formData.school}</span>}
              {formData.school && <span className="w-1 h-1 bg-slate-300 rounded-full" />}
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-600" /> {formData.email}</span>
              {formData.phone && <><span className="w-1 h-1 bg-slate-300 rounded-full" /><span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-eco-600" /> {maskPhone(formData.phone)}</span></>}
              {formData.enrollYear && <><span className="w-1 h-1 bg-slate-300 rounded-full" /><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-eco-600" /> {formData.enrollYear} 级</span></>}
            </div>
            {(formData.wechat || formData.department) && (
              <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 mt-2">
                {formData.department && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-eco-600" /> {formData.department}</span>}
                {formData.wechat && <><span className="w-1 h-1 bg-slate-300 rounded-full" /><span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WeChat</span></>}
              </div>
            )}
          </div>
        )}

        {/* Address Book */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-eco-600" /> 我的收货地址</h3>
            <button onClick={openNewAddress} className="flex items-center gap-1 px-3 py-1.5 bg-eco-50 hover:bg-eco-100 text-eco-700 rounded-xl text-xs font-semibold transition-colors">
              <Plus className="w-3.5 h-3.5" /> 添加地址
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center">
              <div className="text-4xl mb-2">📮</div>
              <p className="text-sm text-slate-500 mb-3">暂无收货地址，添加一个吧</p>
              <button onClick={openNewAddress} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">
                <Plus className="w-3.5 h-3.5" /> 添加第一个地址
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl border-2 p-4 transition-all ${addr.isDefault ? 'border-eco-300 bg-gradient-to-br from-eco-50/70 to-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm">{addr.name}</span>
                      <span className="text-xs text-slate-500">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-eco-500 text-white rounded-lg text-[10px] font-bold">
                          <Star className="w-3 h-3" /> 默认
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefaultAddress(idx)} className="px-2 py-1 text-xs text-eco-700 hover:bg-eco-50 rounded-lg font-semibold transition-colors">
                          设为默认
                        </button>
                      )}
                      <button onClick={() => openEditAddress(idx)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteAddress(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    {[addr.province, addr.city, addr.district].filter(Boolean).join(' / ')}
                    {([addr.province, addr.city, addr.district].filter(Boolean).length > 0) && ' · '}
                    {addr.detail}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Address Editor Modal */}
        {showAddressEditor && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setShowAddressEditor(false)}>
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{editingAddressIndex >= 0 ? '编辑地址' : '新增收货地址'}</h3>
                <button onClick={() => setShowAddressEditor(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <FieldInput label="收货人" value={addressDraft.name} onChange={(v) => setAddressDraft({ ...addressDraft, name: v })} placeholder="请输入收货人姓名" icon={<User className="w-4 h-4" />} />
                <FieldInput label="手机号" value={addressDraft.phone} onChange={(v) => setAddressDraft({ ...addressDraft, phone: v })} placeholder="请输入手机号" type="tel" icon={<Phone className="w-4 h-4" />} />
                <div className="grid grid-cols-3 gap-2">
                  <FieldInput label="省" value={addressDraft.province} onChange={(v) => setAddressDraft({ ...addressDraft, province: v })} placeholder="省" compact />
                  <FieldInput label="市" value={addressDraft.city} onChange={(v) => setAddressDraft({ ...addressDraft, city: v })} placeholder="市" compact />
                  <FieldInput label="区 / 县" value={addressDraft.district} onChange={(v) => setAddressDraft({ ...addressDraft, district: v })} placeholder="区" compact />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">详细地址</label>
                  <textarea
                    value={addressDraft.detail}
                    onChange={(e) => setAddressDraft({ ...addressDraft, detail: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-eco-400 focus:ring-4 focus:ring-eco-100/50 outline-none transition-all resize-none"
                    placeholder="街道、楼栋、门牌号等"
                  />
                </div>
                <label className="flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-eco-300 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-800">设为默认地址</div>
                    <div className="text-xs text-slate-500">下单时优先使用此地址</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!addressDraft.isDefault}
                    onChange={(e) => setAddressDraft({ ...addressDraft, isDefault: e.target.checked })}
                    className="w-5 h-5 accent-eco-500"
                  />
                </label>
              </div>
              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 flex gap-2">
                <button onClick={() => setShowAddressEditor(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors">
                  取消
                </button>
                <button onClick={handleSaveAddress} className="flex-1 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                  保存地址
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-eco-600" /> 账户安全</h3>
          <div className="space-y-3">
            <SecurityRow label="登录密码" status="已设置" positive={true} />
            <SecurityRow label="实名认证" status="已认证" positive={true} />
            <SecurityRow label="邮箱验证" status="已验证" positive={true} />
            <SecurityRow label="校园身份" status="已验证" positive={true} />
            <SecurityRow label="双重验证" status="未开启" positive={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, type = 'text', icon, compact }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-9' : 'px-4'} ${compact ? 'py-2 text-xs' : 'py-2.5 text-sm'} bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-eco-400 focus:ring-4 focus:ring-eco-100/50 outline-none transition-all`}
        />
      </div>
    </div>
  );
}

function CreditItem({ label, score, positive }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-slate-600 text-xs">{label}</span>
      <span className={`text-xs font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>{score}</span>
    </div>
  );
}

function SecurityRow({ label, status, positive }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3.5 bg-slate-50 rounded-xl">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={`text-xs font-bold ${positive ? 'text-eco-600 bg-eco-50 px-2 py-1 rounded-lg' : 'text-slate-400 bg-slate-100 px-2 py-1 rounded-lg'}`}>{status}</span>
    </div>
  );
}

function maskPhone(phone) {
  if (!phone) return '';
  const s = String(phone);
  if (s.length <= 7) return s;
  return s.slice(0, 3) + '****' + s.slice(-4);
}
