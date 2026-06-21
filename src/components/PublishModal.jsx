import { useState, useRef } from 'react';
import { X, Upload, Tag, MapPin, FileText, Camera, Sparkles, DollarSign, ImagePlus, Trash2 } from 'lucide-react';

const categories = ['数码电子', '教材书籍', '生活日用', '运动户外', '服饰鞋包', '美妆护肤', '乐器'];

const categoryEmojiMap = {
  '数码电子': ['📱', '💻', '⌚', '🎧', '📷', '🖥️'],
  '教材书籍': ['📚', '📖', '📝', '🎓', '📓', '📘'],
  '生活日用': ['🧴', '🪴', '💡', '🧺', '🛋️', '🍳'],
  '运动户外': ['⚽', '🏀', '🏃', '🚴', '🎾', '🏓'],
  '服饰鞋包': ['👕', '👟', '👜', '🧥', '👖', '👗'],
  '美妆护肤': ['💄', '💅', '🧴', '🌸', '🪞', '✨'],
  '乐器': ['🎸', '🎹', '🎺', '🥁', '🎻', '🎤'],
  '其他': ['🎁', '⭐', '🌟', '💫', '🎉', '🎀']
};

const gradients = [
  { id: 'g1', gradient: ['#667eea', '#764ba2'] },
  { id: 'g2', gradient: ['#f093fb', '#f5576c'] },
  { id: 'g3', gradient: ['#4facfe', '#00f2fe'] },
  { id: 'g4', gradient: ['#43e97b', '#38f9d7'] },
  { id: 'g5', gradient: ['#fa709a', '#fee140'] },
  { id: 'g6', gradient: ['#a8edea', '#fed6e3'] },
  { id: 'g7', gradient: ['#ffecd2', '#fcb69f'] },
  { id: 'g8', gradient: ['#a1c4fd', '#c2e9fb'] },
  { id: 'g9', gradient: ['#f6d365', '#fda085'] },
  { id: 'g10', gradient: ['#fbc2eb', '#a6c1ee'] },
  { id: 'g11', gradient: ['#84fab0', '#8fd3f4'] },
  { id: 'g12', gradient: ['#fccb90', '#d57eeb'] }
];

const MAX_IMAGES = 5;

function buildEmojiImageUrl(emoji, gradient) {
  const [g1, g2] = gradient;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${g1}"/><stop offset="100%" style="stop-color:${g2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><circle cx="340" cy="60" r="80" fill="white" fill-opacity="0.12"/><circle cx="60" cy="340" r="60" fill="white" fill-opacity="0.1"/><text x="200" y="250" font-size="130" text-anchor="middle">${emoji}</text></svg>`
  )}`;
}

export default function PublishModal({ onClose, onPublish }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: '',
    condition: '9成新',
    description: '',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('📦');
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  const recommendedEmojis = categoryEmojiMap[formData.category] || categoryEmojiMap['其他'];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_IMAGES - images.length;
    const toProcess = files.slice(0, remaining);

    Promise.all(
      toProcess.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ dataUrl: reader.result, name: file.name });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    )
      .then((results) => {
        setImages((prev) => [...prev, ...results]);
      })
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePriceChange = (value) => {
    const updated = { ...formData, price: value };
    if (!formData.originalPrice && value) {
      const num = parseFloat(value);
      if (!isNaN(num)) updated.originalPrice = (num * 2).toFixed(num % 1 === 0 ? 0 : 2);
    }
    setFormData(updated);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = '请输入商品名称';
      if (formData.title.length > 30) newErrors.title = '商品名称不能超过30个字';
      if (!formData.category) newErrors.category = '请选择商品分类';
    }
    if (currentStep === 2) {
      if (!formData.price || isNaN(formData.price)) newErrors.price = '请输入合理的价格';
      if (parseFloat(formData.price) < 0) newErrors.price = '价格不能为负数';
    }
    if (currentStep === 3) {
      if (!formData.description.trim()) newErrors.description = '请简单描述一下你的商品';
      if (formData.description.length > 200) newErrors.description = '描述不能超过200字';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(step + 1);
      else handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const primaryImage =
      images.length > 0
        ? images[0].dataUrl
        : buildEmojiImageUrl(selectedEmoji, selectedGradient.gradient);

    const product = {
      ...formData,
      images: images.map((i) => i.dataUrl),
      image: primaryImage,
      emoji: selectedEmoji,
      liked: false,
      status: 'active',
      matchScore: 80 + Math.floor(Math.random() * 15),
      matchFactor: '基于新鲜度推荐',
      sellerId: 'u1',
      views: 0,
      likes: 0,
      publishedAt: new Date().toISOString().split('T')[0]
    };

    onPublish(product);
  };

  const previewImage =
    images.length > 0
      ? images[0].dataUrl
      : buildEmojiImageUrl(selectedEmoji, selectedGradient.gradient);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-all duration-300 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-slate-900 text-lg">发布闲置</h2>
            <span className="text-xs font-semibold text-eco-600 bg-eco-50 px-2.5 py-1 rounded-lg">
              {step}/3
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-gradient-to-r from-eco-400 to-eco-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="overflow-y-auto p-5" style={{ maxHeight: 'calc(92vh - 180px)' }}>
          {step === 1 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <FileText className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
                  商品名称
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：九成新 iPad Air 5 64G"
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all outline-none ${
                    errors.title
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-eco-400 focus:bg-white focus:ring-4 focus:ring-eco-100/50'
                  }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.title ? (
                    <span className="text-xs text-red-500">{errors.title}</span>
                  ) : (
                    <span className="text-xs text-slate-400">简单明了的标题更容易被搜索到</span>
                  )}
                  <span className="text-xs text-slate-400">{formData.title.length}/30</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <Tag className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
                  商品分类
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        formData.category === cat
                          ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-lg shadow-eco-500/20 scale-105'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && <span className="text-xs text-red-500 mt-1 block">{errors.category}</span>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <ImagePlus className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
                  商品图片（可选，最多 {MAX_IMAGES} 张）
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden relative group border-2 border-slate-200 shadow-sm"
                    >
                      <img src={img.dataUrl} alt={`图片 ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-eco-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                          主图
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        aria-label="删除图片"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-eco-400 hover:bg-eco-50 text-slate-400 hover:text-eco-600 flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-[10px] font-semibold">
                        {images.length}/{MAX_IMAGES}
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    💡 或快速选择图标作为封面
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {recommendedEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`aspect-square rounded-xl overflow-hidden relative transition-all text-4xl ${
                          selectedEmoji === emoji && images.length === 0
                            ? 'ring-4 ring-eco-500 ring-offset-2 scale-105'
                            : 'hover:scale-105 opacity-80 hover:opacity-100 border border-slate-200'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${selectedGradient.gradient[0]}, ${selectedGradient.gradient[1]})`
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-700 mb-2">🎨 封面底色</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {gradients.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGradient(g)}
                        className={`aspect-square rounded-xl overflow-hidden relative transition-all ${
                          selectedGradient.id === g.id
                            ? 'ring-4 ring-eco-500 ring-offset-2 scale-105'
                            : 'hover:scale-105 opacity-80 hover:opacity-100 border border-slate-200'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <DollarSign className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
                  售卖价格（元）
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-eco-600">¥</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl text-2xl font-black border-2 transition-all outline-none ${
                      errors.price
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-eco-400 focus:bg-white focus:ring-4 focus:ring-eco-100/50'
                    }`}
                  />
                </div>
                {errors.price && <span className="text-xs text-red-500 mt-1.5 block">{errors.price}</span>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  原价（选填）
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">¥</span>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="原价可以让买家看到优惠力度"
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-base font-semibold border-2 border-slate-200 bg-slate-50 text-slate-700 focus:border-eco-400 focus:bg-white focus:ring-4 focus:ring-eco-100/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  新旧程度
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['全新', '9成新', '8成新', '7成新'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: c })}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                        formData.condition === c
                          ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-md'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <MapPin className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
                  交易地点 / 所在校区
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="例如：紫金港校区 / 校门口自取 / 支持快递"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-eco-400 focus:bg-white focus:ring-4 focus:ring-eco-100/50 outline-none transition-all"
                />
              </div>

              <div className="bg-gradient-to-br from-eco-50 to-emerald-50 rounded-2xl p-4 border border-eco-100">
                <p className="text-xs text-eco-700 leading-relaxed font-medium">
                  💡 <span className="font-bold">定价小贴士：</span>
                  参考同类商品的价格，结合新旧程度，设置合理的价格能让你的商品更快售出。
                  一般闲置商品建议定价为原价的 30% - 60%。
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <Camera className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
                  商品描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简单描述一下你的商品吧~ 包括使用时长、物品成色、是否有原装配件等信息，让买家更放心"
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all outline-none resize-none ${
                    errors.description
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-eco-400 focus:bg-white focus:ring-4 focus:ring-eco-100/50'
                  }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.description ? (
                    <span className="text-xs text-red-500">{errors.description}</span>
                  ) : (
                    <span className="text-xs text-slate-400">详细的描述能提升买家购买意愿</span>
                  )}
                  <span className="text-xs text-slate-400">{formData.description.length}/200</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-eco-200 p-5">
                <h4 className="font-bold text-slate-900 text-sm mb-3">📋 发布信息预览</h4>
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                    <img src={previewImage} alt="预览" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{formData.title || '未填写商品名称'}</p>
                    <p className="text-xs text-slate-500">{formData.category || '未选择分类'}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">价格</span>
                    <span className="font-bold text-eco-600">¥{formData.price || '0'}</span>
                  </div>
                  {formData.originalPrice && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">原价</span>
                      <span className="font-semibold text-slate-500 line-through">¥{formData.originalPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">新旧</span>
                    <span className="font-semibold text-slate-700">{formData.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">描述</span>
                    <span className="font-semibold text-slate-700 text-right max-w-[60%] truncate">
                      {formData.description || '未填写'}
                    </span>
                  </div>
                  {formData.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">地点</span>
                      <span className="font-semibold text-slate-700 text-right max-w-[60%] truncate">
                        {formData.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4 flex gap-2.5">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
            >
              ← 上一步
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            disabled={step === 3 && (!formData.title || !formData.category || !formData.price)}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-eco-500/30 hover:shadow-xl hover:shadow-eco-500/40 transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {step === 3 ? '🚀 立即发布' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
