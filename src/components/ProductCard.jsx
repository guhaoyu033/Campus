import { Heart, Eye, MapPin } from 'lucide-react';

export default function ProductCard({ product, onClick, onToggleLike }) {
  const price = parseFloat(product.price) || 0;
  const originalPrice = parseFloat(product.originalPrice) || price;
  const discount = originalPrice > 0 && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;
  const matchColor = product.matchScore >= 95 ? 'text-rose-600 bg-rose-50' :
                      product.matchScore >= 90 ? 'text-orange-600 bg-orange-50' :
                                                  'text-eco-700 bg-eco-50';

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-eco-300 transition-all duration-300 flex flex-col"
    >
      {/* 商品图片区 */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.opacity = '0';
            e.currentTarget.nextElementSibling.style.opacity = '1';
          }}
        />
        {/* 图片加载失败占位符 */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-eco-100 to-emerald-100">
          <span className="text-6xl">
            {product.title.includes('iPad') || product.title.includes('Mac') ? '💻' :
             product.title.includes('鞋') || product.title.includes('跑鞋') ? '👟' :
             product.title.includes('书') || product.title.includes('教材') ? '📚' :
             product.title.includes('车') || product.title.includes('滑板') ? '🛴' :
             product.title.includes('键盘') || product.title.includes('鼠标') ? '⌨️' :
             product.title.includes('吉他') || product.title.includes('琴') ? '🎸' : '🎁'}
          </span>
        </div>

        {/* 匹配度标签 */}
        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md backdrop-blur-sm ${matchColor}`}>
          🔥 {product.matchScore}%匹配
        </div>

        {/* 省钱金额 */}
        <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-slate-700 shadow-sm">
          {originalPrice > price && `省 ¥${Math.round(originalPrice - price)}`}
        </div>

        {/* 折扣标签 */}
        {discount > 0 && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-bold shadow-md">
            {discount}% OFF
          </div>
        )}

        {/* 收藏按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(product.id);
          }}
          className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            product.liked
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/50'
              : 'bg-white/95 backdrop-blur-sm text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${product.liked ? 'fill-current scale-110' : ''}`} />
        </button>
      </div>

      {/* 商品信息区 */}
      <div className="p-3.5 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-eco-600 transition-colors">
          {product.title}
        </h3>

        {/* 价格行 - 渐变文字 */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black bg-gradient-to-r from-eco-600 to-emerald-500 bg-clip-text text-transparent leading-none">
            ¥{price}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-slate-400 line-through">¥{originalPrice}</span>
          )}
        </div>

        {/* 位置 + 成色 */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2.5">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="truncate">{product.location}</span>
          <span className="mx-0.5 text-slate-300">·</span>
          <span className="text-slate-400">{product.condition}</span>
        </div>

        {/* 底部统计栏 */}
        <div className="mt-auto pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-eco-700 bg-eco-50 px-2 py-0.5 rounded-full border border-eco-200/50 truncate max-w-[60%]">
              {product.matchFactor}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                <span>{product.views}</span>
              </span>
              <span className="flex items-center gap-0.5">
                <Heart className={`w-3 h-3 ${product.liked ? 'text-rose-500 fill-rose-500' : ''}`} />
                <span>{product.likes}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
