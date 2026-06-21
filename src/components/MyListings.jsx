import { useState } from 'react';
import { X, Eye, EyeOff, Tag, TrendingUp, Clock, Edit2, Trash2, Package, CheckCircle, ShoppingCart } from 'lucide-react';

export default function MyListings({ products, user, onClose, onSelectProduct, onUpdateStatus, onDeleteProduct, onToast }) {
  const [filter, setFilter] = useState('all');

  if (!user) return null;

  const myProducts = products.filter(p => p.sellerId === user.id);

  const filteredProducts = myProducts.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.status === 'active';
    if (filter === 'offline') return p.status === 'offline';
    if (filter === 'sold') return p.status === 'sold';
    return true;
  });

  const stats = {
    all: myProducts.length,
    active: myProducts.filter(p => p.status === 'active').length,
    offline: myProducts.filter(p => p.status === 'offline').length,
    sold: myProducts.filter(p => p.status === 'sold').length
  };

  const toggleStatus = (product) => {
    const newStatus = product.status === 'active' ? 'offline' : 'active';
    onUpdateStatus(product.id, newStatus);
    onToast && onToast(newStatus === 'active' ? `已上架：${product.title} ✅` : `已下架：${product.title}`);
  };

  const markSold = (product) => {
    onUpdateStatus(product.id, 'sold');
    onToast && onToast(`恭喜！「${product.title}」已标记售出 🎉`);
  };

  const relist = (product) => {
    onUpdateStatus(product.id, 'active');
    onToast && onToast(`「${product.title}」已重新上架 ✨`);
  };

  const deleteProduct = (product) => {
    if (window.confirm(`确认删除商品「${product.title}」？此操作不可撤销。`)) {
      onDeleteProduct(product.id);
      onToast && onToast(`已删除：${product.title}`);
    }
  };

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    offline: 'bg-slate-100 text-slate-600 border-slate-200',
    sold: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  const statusLabels = {
    active: '已上架',
    offline: '已下架',
    sold: '已售出'
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">我的发布</h2>
              <p className="text-xs text-slate-500">管理你的闲置商品，上架/下架/标记已售</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-3 py-1.5 bg-eco-50 text-eco-700 rounded-lg font-semibold">
              共 {stats.all} 件商品
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon="📦" label="全部" value={stats.all} active={filter === 'all'} onClick={() => setFilter('all')} color="from-slate-50 to-white border-slate-200 text-slate-700" />
          <StatCard icon="✅" label="已上架" value={stats.active} active={filter === 'active'} onClick={() => setFilter('active')} color="from-emerald-50 to-white border-emerald-200 text-emerald-700" />
          <StatCard icon="⏸️" label="已下架" value={stats.offline} active={filter === 'offline'} onClick={() => setFilter('offline')} color="from-slate-50 to-white border-slate-200 text-slate-600" />
          <StatCard icon="🎉" label="已售出" value={stats.sold} active={filter === 'sold'} onClick={() => setFilter('sold')} color="from-amber-50 to-white border-amber-200 text-amber-700" />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">暂无商品</h3>
            <p className="text-sm text-slate-500 mb-5">这里还没有商品，快去发布第一件闲置物品吧！</p>
            <button onClick={onClose} className="px-5 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/20 hover:shadow-xl transition-all">
              🚀 立即发布
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map(product => (
              <div key={product.id} className={`bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all ${product.status === 'offline' ? 'opacity-75' : ''}`}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex-shrink-0 overflow-hidden cursor-pointer flex items-center justify-center text-4xl bg-gradient-to-br from-eco-100 to-emerald-100"
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    {product.image && product.image.startsWith('data:') ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>{product.title.includes('iPad') || product.title.includes('Mac') ? '💻' : product.title.includes('鞋') || product.title.includes('跑鞋') ? '👟' : product.title.includes('书') || product.title.includes('教材') ? '📚' : product.title.includes('车') ? '🛴' : product.title.includes('键盘') || product.title.includes('鼠标') ? '⌨️' : '🎁'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3
                        className="font-bold text-slate-900 text-base hover:text-eco-600 cursor-pointer truncate"
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                      >
                        {product.title}
                      </h3>
                      <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-lg border font-semibold ${statusColors[product.status]}`}>
                        {statusLabels[product.status]}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xl font-black text-eco-600">¥{product.price}</span>
                      {product.originalPrice && <span className="text-xs text-slate-400 line-through">¥{product.originalPrice}</span>}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{product.publishedAt || '刚刚'}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{product.views || 0} 浏览</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{product.likes || 0} 收藏</span>
                      {product.category && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{product.category}</span>}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {product.status === 'active' && (
                        <>
                          <button onClick={() => toggleStatus(product)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                            <EyeOff className="w-3.5 h-3.5" /> 下架
                          </button>
                          <button onClick={() => markSold(product)} className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> 标记已售
                          </button>
                        </>
                      )}
                      {product.status === 'offline' && (
                        <>
                          <button onClick={() => toggleStatus(product)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition-colors">
                            <Eye className="w-3.5 h-3.5" /> 重新上架
                          </button>
                        </>
                      )}
                      {product.status === 'sold' && (
                        <button onClick={() => relist(product)} className="flex items-center gap-1 px-3 py-1.5 bg-eco-50 hover:bg-eco-100 text-eco-700 rounded-lg text-xs font-medium transition-colors">
                          <Package className="w-3.5 h-3.5" /> 重新上架
                        </button>
                      )}
                      <button onClick={() => onSelectProduct && onSelectProduct(product)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors">
                        <Edit2 className="w-3.5 h-3.5" /> 查看
                      </button>
                      <button onClick={() => deleteProduct(product)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> 删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">提升成交技巧</h4>
            <p className="text-xs text-slate-600 leading-relaxed">填写详细描述、上传真实图片、设置合理价格能大幅提升成交率。</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200">
            <div className="text-2xl mb-2">📦</div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">库存管理</h4>
            <p className="text-xs text-slate-600 leading-relaxed">商品卖出后请及时标记"已售出"，避免买家咨询已卖出商品。</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
            <div className="text-2xl mb-2">🛒</div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">临时下架</h4>
            <p className="text-xs text-slate-600 leading-relaxed">商品还在，但暂不出售时请选择"下架"，需要时可以一键重新上架。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, active, onClick, color }) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl border transition-all text-left bg-gradient-to-br ${color} ${active ? 'ring-2 ring-eco-500 shadow-md scale-[1.02]' : 'hover:shadow-sm'}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-black text-slate-900 mb-0.5">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </button>
  );
}
