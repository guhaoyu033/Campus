import { useState } from 'react';
import { X, Heart, Clock, Eye, TrendingUp, ShoppingCart, Package, CheckCircle, Circle, Trash2, ChevronRight, Filter, Edit3, Sparkles } from 'lucide-react';

export default function MyFavorites({ products, user, onClose, onToggleLike, onSelectProduct, onAddToCart, onToast }) {
  const favorites = products.filter(p => p.liked);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', ...new Set(favorites.map(p => p.category).filter(Boolean))];

  const filtered = activeCategory === '全部'
    ? favorites
    : favorites.filter(p => p.category === activeCategory);

  const allSelected = filtered.length > 0 && filtered.every(p => selectedIds.includes(p.id));

  const handleToggleSelect = (productId) => {
    setSelectedIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filtered.some(p => p.id === id)));
    } else {
      const newIds = filtered.map(p => p.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...newIds])));
    }
  };

  const handleBulkRemove = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    selectedIds.forEach(id => onToggleLike && onToggleLike(id));
    setSelectedIds([]);
    setEditMode(false);
    onToast && onToast(`已取消收藏 ${count} 件商品 💔`);
  };

  const handleQuickRemove = (productId, e) => {
    e.stopPropagation();
    onToggleLike && onToggleLike(productId);
    onToast && onToast('已取消收藏 💔');
  };

  const handleExitEditMode = () => {
    setEditMode(false);
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">我的收藏</h2>
                <p className="text-xs text-slate-500">{favorites.length > 0 ? `共收藏 ${favorites.length} 件商品` : '还没有收藏任何商品'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold">❤️ {favorites.length}</span>
              {favorites.length > 0 && (
                <button
                  onClick={() => editMode ? handleExitEditMode() : setEditMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    editMode
                      ? 'bg-slate-700 text-white hover:bg-slate-800'
                      : 'bg-eco-100 text-eco-700 hover:bg-eco-200'
                  }`}
                >
                  {editMode ? (
                    <><X className="w-3.5 h-3.5" /> 取消</>
                  ) : (
                    <><Edit3 className="w-3.5 h-3.5" /> 编辑</>
                  )}
                </button>
              )}
            </div>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-md shadow-eco-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                  {cat !== '全部' && (
                    <span className="ml-1 opacity-80">
                      ({favorites.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {editMode && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleToggleSelectAll}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                {allSelected ? (
                  <CheckCircle className="w-4 h-4 text-eco-600 fill-eco-100" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
                {allSelected ? '取消全选' : '全选'}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  已选 <span className="font-bold text-eco-600">{selectedIds.length}</span> 件
                </span>
                <button
                  onClick={handleBulkRemove}
                  disabled={selectedIds.length === 0}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedIds.length > 0
                      ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  删除所选
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center animate-fade-in">
            <div className="text-7xl mb-5 animate-slide-up">💔</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">收藏夹空空如也</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              看到心仪的商品，记得点击爱心收藏哦！<br />
              好东西值得被珍藏～
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              去逛逛好物 →
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">该分类暂无商品</h3>
            <p className="text-sm text-slate-500 mb-5">换个分类看看吧～</p>
            <button
              onClick={() => setActiveCategory('全部')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-eco-100 text-eco-700 rounded-xl font-semibold text-sm hover:bg-eco-200 transition-all"
            >
              查看全部收藏
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(product => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group relative ${
                  editMode ? 'border-eco-300' : 'border-slate-200'
                }`}
              >
                {editMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(product.id);
                    }}
                    className="absolute top-3 left-3 z-10 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-all"
                  >
                    {selectedIds.includes(product.id) ? (
                      <CheckCircle className="w-5 h-5 text-eco-600 fill-eco-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                )}

                <div
                  className="aspect-square bg-gradient-to-br from-eco-100 to-emerald-100 cursor-pointer relative"
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-7xl">
                    {product.title.includes('iPad') || product.title.includes('Mac') ? '💻' :
                     product.title.includes('鞋') || product.title.includes('跑鞋') ? '👟' :
                     product.title.includes('书') || product.title.includes('教材') || product.title.includes('考研') ? '📚' :
                     product.title.includes('车') || product.title.includes('滑板') ? '🛴' :
                     product.title.includes('键盘') || product.title.includes('鼠标') ? '⌨️' :
                     product.title.includes('吉他') || product.title.includes('琴') ? '🎸' : '🎁'}
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                    {product.matchScore || 85}% 匹配
                  </div>
                  {product.status && product.status !== 'active' && (
                    <div className="absolute top-2 left-2 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                      {product.status === 'sold' ? '已售出' : product.status === 'offline' ? '已下架' : ''}
                    </div>
                  )}

                  {!editMode && (
                    <button
                      onClick={(e) => handleQuickRemove(product.id, e)}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:scale-110 transition-all"
                      title="取消收藏"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </button>
                  )}
                </div>

                <div className="p-4">
                  <h3
                    className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-1 cursor-pointer hover:text-eco-600 transition-colors"
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-eco-600">¥{product.price}</span>
                    {product.originalPrice && <span className="text-[10px] text-slate-400 line-through">¥{product.originalPrice}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {product.views || 0}</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {product.publishedAt || '刚刚'}</span>
                    {product.category && <span className="px-1.5 py-0.5 bg-slate-100 rounded">{product.category}</span>}
                  </div>

                  {editMode ? (
                    <button
                      onClick={(e) => handleQuickRemove(product.id, e)}
                      className="w-full py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      取消收藏
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                        className="flex-1 py-2 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-xs font-semibold hover:shadow-md hover:shadow-eco-500/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" /> 查看详情
                      </button>
                      {product.status === 'active' && onAddToCart && (
                        <button
                          onClick={() => onAddToCart(product.id, 1)}
                          className="flex items-center justify-center w-10 h-10 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onToggleLike && onToggleLike(product.id)}
                        className="flex items-center justify-center w-10 h-10 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
