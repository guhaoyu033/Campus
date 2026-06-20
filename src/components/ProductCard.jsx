import { Heart, Eye, MapPin } from 'lucide-react';

export default function ProductCard({ product, onClick, onToggleLike }) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const matchColor = product.matchScore >= 95 ? 'text-rose-600 bg-rose-50' :
                      product.matchScore >= 90 ? 'text-orange-600 bg-orange-50' :
                                                  'text-eco-700 bg-eco-50';

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-eco-300 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23dcfce7"/><text x="50%25" y="50%25" font-size="24" text-anchor="middle" fill="%2315803d" font-family="sans-serif">闲置图片</text></svg>';
          }}
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${matchColor} shadow-sm backdrop-blur-sm`}>
          🔥 {product.matchScore}%匹配
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700">
          省 ¥{product.originalPrice - product.price}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(product.id);
          }}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            product.liked
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/95 backdrop-blur-sm text-slate-400 hover:bg-rose-50 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform duration-300 ${product.liked ? 'fill-current scale-110' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-eco-700 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-eco-600">¥{product.price}</span>
          <span className="text-xs text-slate-400 line-through">¥{product.originalPrice}</span>
          <span className="text-[10px] text-rose-500 font-medium bg-rose-50 px-1.5 py-0.5 rounded">{discount}%OFF</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
          <MapPin className="w-3 h-3" />
          <span>{product.location}</span>
          <span className="mx-1">·</span>
          <span>{product.condition}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-eco-700 bg-eco-50 px-2 py-0.5 rounded-full">{product.matchFactor}</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Eye className="w-3 h-3" />
              <span>{product.views}</span>
              <span className="mx-0.5">·</span>
              <Heart className={`w-3 h-3 ${product.liked ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>{product.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}