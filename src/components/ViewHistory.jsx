import { useState } from 'react';
import { X, Clock, Trash2, ShoppingCart, Heart, MessageCircle } from 'lucide-react';

const ViewHistory = ({ history, onClose, onSelectProduct, onAddToCart, onToggleLike, onToast }) => {
  const [selectedTab, setSelectedTab] = useState('history');

  const handleClearHistory = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('campusflow_viewHistory');
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-eco-600" />
              浏览历史
            </h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </button>
          )}
        </div>

        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setSelectedTab('history')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${selectedTab === 'history' ? 'text-eco-600 border-b-2 border-eco-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            浏览记录 ({history.length})
          </button>
          <button
            onClick={() => setSelectedTab('trending')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${selectedTab === 'trending' ? 'text-eco-600 border-b-2 border-eco-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            猜你喜欢
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {selectedTab === 'history' ? (
          history.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
              <div className="text-7xl mb-5">👀</div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">暂无浏览记录</h3>
              <p className="text-sm text-slate-500 mb-6">快去发现校园里的闲置好物吧！</p>
              <button onClick={onClose} className="px-6 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/20 hover:shadow-xl hover:scale-105 transition-all">
                去逛逛 →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  最近浏览
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-eco-100 to-emerald-100 overflow-hidden">
                      {product.image && product.image.startsWith('data:') ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          {product.title.includes('iPad') || product.title.includes('Mac') ? '💻' :
                           product.title.includes('鞋') || product.title.includes('跑鞋') ? '👟' :
                           product.title.includes('书') || product.title.includes('教材') ? '📚' :
                           product.title.includes('车') || product.title.includes('滑板') ? '🛴' :
                           product.title.includes('键盘') || product.title.includes('鼠标') ? '⌨️' : '🎁'}
                        </div>
                      )}

                      {product.status === 'sold' && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur-sm text-white text-xs font-bold">
                          已售出
                        </div>
                      )}
                      {product.status === 'offline' && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-600/80 backdrop-blur-sm text-white text-xs font-bold">
                          已下架
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAddToCart && onAddToCart(product.id, 1)}
                            disabled={product.status !== 'active'}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${product.status !== 'active' ? 'bg-slate-500/50 text-slate-300' : 'bg-white text-eco-700 hover:bg-eco-50'}`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            购物车
                          </button>
                          <button
                            onClick={() => onToggleLike && onToggleLike(product.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white text-rose-500 hover:bg-rose-50 transition-all"
                          >
                            <Heart className={`w-3.5 h-3.5 ${product.liked ? 'fill-current' : ''}`} />
                            收藏
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm flex-1" onClick={() => onSelectProduct && onSelectProduct(product)}>
                          {product.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-eco-600">¥{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">¥{product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{product.school || '校园'}</span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span>{product.category || '其他'}</span>
                        <span>·</span>
                        <span>{product.likes || 0} 人想要</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-eco-500 to-eco-700 rounded-full" />
              <h3 className="font-bold text-slate-900">✨ 猜你喜欢</h3>
            </div>

            <div className="bg-gradient-to-br from-eco-50 to-emerald-50 rounded-2xl p-4 border border-eco-200/60">
              <div className="text-sm text-eco-700 mb-4">
                基于您的浏览偏好，为您推荐以下商品
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.slice(0, 6).map((product, index) => (
                  <div
                    key={`trending-${product.id}-${index}`}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-eco-100 to-emerald-100 overflow-hidden">
                      {product.image && product.image.startsWith('data:') ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {product.title.includes('iPad') || product.title.includes('Mac') ? '💻' :
                           product.title.includes('鞋') || product.title.includes('跑鞋') ? '👟' :
                           product.title.includes('书') || product.title.includes('教材') ? '📚' : '🎁'}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{product.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-eco-600">¥{product.price}</span>
                        <span className="text-[10px] text-slate-400">{product.matchScore || 85}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHistory;
