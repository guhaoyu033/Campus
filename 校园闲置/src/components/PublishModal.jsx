import { useState, useEffect } from 'react';
import { X, Upload, Tag, DollarSign, FileText, Camera } from 'lucide-react';
import stats from '../data/stats.json';

export default function PublishModal({ onClose, onPublish }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: '数码电子',
    description: '',
    image: '',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const categories = stats.categories.filter((c) => c.id !== 'all').map((c) => c.name);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category) return;
    const placeholderImages = [
      'https://images.unsplash.com/photo-1585790059682-ca18b067e17?w=600',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      'https://images.unsplash.com/photo-1571091718762-74a4b1b5d82a?w=600',
      'https://images.unsplash.com/photo-1517336714731-4eb7b3b5d32a?w=600',
    ];
    onPublish({
      title: form.title,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price) + 100,
      category: form.category,
      description: form.description || '卖家很懒，还没有写描述，但物品真的很棒！',
      image: form.image || placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isValid = form.title && form.price && form.category;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">发布闲置物品</h2>
            <p className="text-xs text-slate-500 mt-0.5">让闲置物品开启新的旅程 🌿</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Camera className="w-4 h-4 text-eco-600" /> 物品图片
            </label>
            <div className="aspect-video rounded-2xl border-2 border-dashed border-eco-200 bg-gradient-to-br from-eco-50 to-white flex items-center justify-center cursor-pointer hover:border-eco-400 transition-colors">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-eco-200 flex items-center justify-center shadow-sm mb-2">
                  <Upload className="w-6 h-6 text-eco-600" />
                </div>
                <div className="text-sm text-slate-600 font-medium">点击上传图片</div>
                <div className="text-xs text-slate-400 mt-0.5">（Demo 环境将使用占位图）</div>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <FileText className="w-4 h-4 text-eco-600" /> 物品名称
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="例如：九成新 iPad Air 5"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-eco-400 focus:ring-2 focus:ring-eco-100 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 text-eco-600" /> 期望价格
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">¥</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-eco-400 focus:ring-2 focus:ring-eco-100 transition-colors font-bold"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                原价 <span className="text-slate-400 font-normal text-xs">(可选)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">¥</span>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-eco-400 focus:ring-2 focus:ring-eco-100 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Tag className="w-4 h-4 text-eco-600" /> 物品分类
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange('category', cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    form.category === cat
                      ? 'bg-eco-600 text-white border-eco-600 shadow-md shadow-eco-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-eco-300 hover:text-eco-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              详细描述 <span className="text-slate-400 font-normal text-xs">(可选)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="描述物品的成色、使用情况、出售原因..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-eco-400 focus:ring-2 focus:ring-eco-100 transition-colors resize-none"
            />
          </div>
        </form>

        <div className="border-t border-slate-200 p-4 bg-white">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-3.5 rounded-2xl font-bold text-white text-sm shadow-lg transition-all ${
              isValid
                ? 'bg-gradient-to-r from-eco-500 to-eco-700 shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            🚀 立即发布，让闲置流动起来
          </button>
        </div>
      </div>
    </div>
  );
}
