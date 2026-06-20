import { useState, useEffect } from 'react';
import { X, MapPin, Star, ShieldCheck, Eye, Heart, MessageCircle, ThumbsUp, Clock, Tag } from 'lucide-react';

export default function ProductDetail({ product, seller, onClose, onToast }) {
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState('desc');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="aspect-[16/10] sm:aspect-video bg-slate-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23dcfce7"/><text x="50%25" y="50%25" font-size="32" text-anchor="middle" fill="%2315803d" font-family="sans-serif">闲置图片</text></svg>';
              }}
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-eco-600 text-white text-sm font-bold shadow-lg shadow-eco-600/30">
            🔥 {product.matchScore}% 精准匹配
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h2>
            <button
              onClick={() => setLiked(!liked)}
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                liked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-200 text-slate-400 hover:border-rose-300'
              }`}
            >
              <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-eco-600">¥{product.price}</span>
            <span className="text-sm text-slate-400 line-through">¥{product.originalPrice}</span>
            <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-semibold">
              省 ¥{product.originalPrice - product.price}
            </span>
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="px-2.5 py-1 bg-eco-50 text-eco-700 rounded-lg text-xs font-medium">
              <Tag className="w-3 h-3 inline mr-1" />{product.category}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
              {product.condition}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
              <MapPin className="w-3 h-3 inline mr-1" />{product.location}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
              <Clock className="w-3 h-3 inline mr-1" />{product.publishedAt}
            </span>
          </div>

          <div className="flex gap-2 border-b border-slate-200 mb-5">
            <button
              onClick={() => setTab('desc')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === 'desc' ? 'border-eco-600 text-eco-700' : 'border-transparent text-slate-500'
              }`}
            >
              商品详情
            </button>
            <button
              onClick={() => setTab('seller')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === 'seller' ? 'border-eco-600 text-eco-700' : 'border-transparent text-slate-500'
              }`}
            >
              卖家信息
            </button>
          </div>

          {tab === 'desc' && (
            <div className="animate-fade-in">
              <div className="flex gap-6 mb-5 p-4 bg-eco-50/50 rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><Eye className="w-4 h-4" /><span className="font-bold text-lg">{product.views}</span></div>
                  <div className="text-xs text-slate-500">浏览</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><Heart className="w-4 h-4" /><span className="font-bold text-lg">{product.likes}</span></div>
                  <div className="text-xs text-slate-500">收藏</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><ThumbsUp className="w-4 h-4" /><span className="font-bold text-lg">{product.matchScore}%</span></div>
                  <div className="text-xs text-slate-500">匹配度</div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{product.description}</p>

              <div className="mt-5 p-4 bg-gradient-to-r from-eco-50 to-emerald-50 rounded-2xl border border-eco-200/60">
                <div className="text-xs text-eco-700 font-semibold mb-1">💡 匹配说明</div>
                <div className="text-sm text-slate-600">{product.matchFactor}，由 CampusFlow 智能匹配算法推荐</div>
              </div>
            </div>
          )}

          {tab === 'seller' && seller && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/60">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-16 h-16 rounded-2xl bg-eco-100"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{seller.name}</span>
                    <ShieldCheck className="w-4 h-4 text-eco-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{seller.school}</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {seller.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-eco-100 text-eco-700 text-[10px] rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-4 bg-eco-50 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-eco-700 font-bold text-xl">
                    <Star className="w-4 h-4" fill="currentColor" />{seller.creditScore}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">信用评分</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <div className="text-slate-800 font-bold text-xl">{seller.tradeCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">成功交易</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl text-center">
                  <div className="text-amber-700 font-bold text-xl flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 mr-1" />已认证
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">校园身份</div>
                </div>
              </div>

              <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-xl">
                ⚠️ 温馨提示：建议校园当面交易，检查物品成色后再付款，保障双方权益。
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 bg-white flex gap-2.5">
          <button
            onClick={() => {
              setLiked(true);
              onToast && onToast('已加入心愿单，价格变动会通知你 💕');
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Heart className="w-4 h-4" /> 我想要
          </button>
          <button
            onClick={() => onToast && onToast('已为您打开私信通道，正在连接卖家... ✉️')}
            className="flex-[1.3] flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 text-white font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> 一键私信
          </button>
        </div>
      </div>
    </div>
  );
}
