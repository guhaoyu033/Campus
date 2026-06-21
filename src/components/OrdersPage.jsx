import { useState } from 'react';
import { X, Package, Clock, CheckCircle, MapPin, Truck, Star, Calendar, User, Phone, Home } from 'lucide-react';

export default function OrdersPage({ orders = [], products, onClose, onUpdateStatus, onToast, onSelectProduct }) {
  const [filter, setFilter] = useState('all');

  const ordersWithProducts = orders.map(o => ({
    ...o,
    product: products.find(p => p.id === o.productId)
  }));

  const filteredOrders = ordersWithProducts.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const stats = {
    all: ordersWithProducts.length,
    pending: ordersWithProducts.filter(o => o.status === 'pending').length,
    shipping: ordersWithProducts.filter(o => o.status === 'shipping').length,
    completed: ordersWithProducts.filter(o => o.status === 'completed').length
  };

  const statusConfig = {
    pending: { label: '待确认', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, step: 1 },
    shipping: { label: '交易中', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck, step: 2 },
    completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, step: 3 },
    cancelled: { label: '已取消', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: X, step: 0 }
  };

  const nextStatus = (current) => {
    if (current === 'pending') return 'shipping';
    if (current === 'shipping') return 'completed';
    return current;
  };

  const nextLabel = (current) => {
    if (current === 'pending') return '确认交易';
    if (current === 'shipping') return '确认收货';
    return '';
  };

  const handleAdvance = (order) => {
    const next = nextStatus(order.status);
    if (next !== order.status) {
      onUpdateStatus(order.id, next);
      onToast && onToast(`订单状态已更新 ✅`);
    }
  };

  const getEmoji = (title) => {
    if (!title) return '🎁';
    if (title.includes('iPad') || title.includes('Mac') || title.includes('笔记本')) return '💻';
    if (title.includes('鞋') || title.includes('跑鞋') || title.includes('运动鞋')) return '👟';
    if (title.includes('书') || title.includes('教材') || title.includes('考研')) return '📚';
    if (title.includes('车') || title.includes('滑板')) return '🛴';
    if (title.includes('键盘') || title.includes('鼠标')) return '⌨️';
    return '🎁';
  };

  const parseAddress = (addr) => {
    if (!addr) {
      return { address: '', receiver: '', phone: '' };
    }
    if (typeof addr === 'object') {
      const region = [addr.province, addr.city, addr.district].filter(Boolean).join(' ');
      const detail = addr.detail || '';
      const receiver = addr.receiver || addr.name || '';
      const phone = addr.phone || '';
      const fullAddress = [region, detail].filter(Boolean).join(' · ');
      return {
        address: fullAddress || '未填写',
        receiver,
        phone
      };
    }
    const raw = String(addr).trim();
    const parenMatch = raw.match(/^(.*?)\s*\(([^\)]+)\)\s*$/);
    if (parenMatch) {
      const addressPart = parenMatch[1].trim();
      const contactPart = parenMatch[2].trim();
      const contactParts = contactPart.split(/\s+/);
      let receiver = '';
      let phone = '';
      if (contactParts.length >= 2) {
        const last = contactParts[contactParts.length - 1];
        if (/^\d{3,}/.test(last)) {
          phone = last;
          receiver = contactParts.slice(0, -1).join(' ');
        } else {
          receiver = contactParts[0];
          phone = contactParts.slice(1).join(' ');
        }
      } else {
        const part = contactParts[0] || '';
        if (/^\d{3,}/.test(part)) phone = part;
        else receiver = part;
      }
      return {
        address: addressPart || '未填写',
        receiver,
        phone
      };
    }
    const parts = raw.split(/\s+/);
    let phoneIdx = -1;
    for (let i = 0; i < parts.length; i++) {
      if (/^\d{3,}/.test(parts[i])) { phoneIdx = i; break; }
    }
    if (phoneIdx >= 0) {
      const addressPart = parts.slice(0, phoneIdx).join(' ');
      const receiver = parts.slice(phoneIdx + 1).join(' ') || '';
      const phone = parts[phoneIdx];
      return {
        address: addressPart || '未填写',
        receiver,
        phone
      };
    }
    return { address: raw, receiver: '', phone: '' };
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
              <h2 className="font-bold text-slate-900 text-lg">我的订单</h2>
              <p className="text-xs text-slate-500">查看和管理你的所有交易</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-eco-50 text-eco-700 rounded-lg text-xs font-semibold">
            共 {ordersWithProducts.length} 个订单
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon="📦" label="全部" value={stats.all} active={filter === 'all'} onClick={() => setFilter('all')} color="from-slate-50 to-white border-slate-200 text-slate-700" />
          <StatCard icon="⏳" label="待确认" value={stats.pending} active={filter === 'pending'} onClick={() => setFilter('pending')} color="from-amber-50 to-white border-amber-200 text-amber-700" />
          <StatCard icon="🚚" label="交易中" value={stats.shipping} active={filter === 'shipping'} onClick={() => setFilter('shipping')} color="from-blue-50 to-white border-blue-200 text-blue-700" />
          <StatCard icon="✅" label="已完成" value={stats.completed} active={filter === 'completed'} onClick={() => setFilter('completed')} color="from-emerald-50 to-white border-emerald-200 text-emerald-700" />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
            <div className="text-7xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">暂无订单</h3>
            <p className="text-sm text-slate-500 mb-5">还没有产生订单记录，去首页挑选心仪商品下单吧！</p>
            <button onClick={onClose} className="px-5 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/20 hover:shadow-xl transition-all">
              去购物 →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const addr = parseAddress(order.address);
              const hasContact = addr.receiver || addr.phone;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className={`px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r ${order.status === 'completed' ? 'from-emerald-50 to-white' : order.status === 'pending' ? 'from-amber-50 to-white' : order.status === 'shipping' ? 'from-blue-50 to-white' : 'from-slate-50 to-white'}`}>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${sc.color.split(' ')[1]}`} />
                      <span className="text-xs font-semibold text-slate-700">订单号: {order.id.slice(-10)}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold ${sc.color}`}>{sc.label}</span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div onClick={() => order.product && onSelectProduct && onSelectProduct(order.product)} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-eco-100 to-emerald-100 flex-shrink-0 overflow-hidden cursor-pointer flex items-center justify-center text-4xl">
                        {order.product?.image?.startsWith('data:') ? (
                          <img src={order.product.image} alt={order.product.title} className="w-full h-full object-cover" />
                        ) : (
                          <span>{getEmoji(order.productTitle)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 onClick={() => order.product && onSelectProduct && onSelectProduct(order.product)} className="font-bold text-slate-900 text-base mb-2 hover:text-eco-600 cursor-pointer truncate">
                          {order.productTitle || '商品'}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-lg font-black text-eco-600">¥{order.price}</span>
                          <span className="text-xs text-slate-500">× {order.qty}</span>
                        </div>
                        <div className="text-right mt-2 pt-2 border-t border-slate-100">
                          <span className="text-xs text-slate-500 mr-2">订单总额</span>
                          <span className="text-xl font-black text-slate-800">¥{(order.price * order.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl">
                        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-500 font-medium">下单时间</div>
                          <div className="text-xs text-slate-700 font-semibold truncate">{order.createdAt ? new Date(order.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2.5 bg-gradient-to-br from-eco-50/80 to-emerald-50/80 rounded-xl border border-eco-100/80">
                        <div className="w-8 h-8 rounded-xl bg-eco-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-eco-500/30">
                          <Home className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] text-eco-700 font-bold mb-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> 配送地址
                          </div>
                          <div className="text-sm text-slate-800 font-bold leading-snug break-words">{addr.address}</div>
                          {hasContact ? (
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 flex-wrap">
                              {addr.receiver && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-blue-500" />
                                  <span className="font-semibold">{addr.receiver}</span>
                                </span>
                              )}
                              {addr.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-emerald-500" />
                                  <span className="font-mono text-[11px]">{addr.phone}</span>
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="mt-1 text-[11px] text-slate-500 italic">（未包含收货人及电话信息）</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-eco-500 inline-block" /> 订单流程
                      </div>
                      <div className="flex items-center gap-2">
                        {['pending', 'shipping', 'completed'].map((s, i) => (
                          <div key={s} className="flex items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${sc.step >= i + 1 ? 'bg-gradient-to-br from-eco-500 to-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                            {i < 2 && <div className={`w-8 sm:w-12 h-0.5 ${sc.step > i + 1 ? 'bg-eco-500' : 'bg-slate-200'}`} />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {(order.status === 'pending' || order.status === 'shipping') && (
                      <button onClick={() => {
                        const msg = order.status === 'pending'
                          ? `确认与买家进行「${order.productTitle}」的交易？`
                          : `确认已收到「${order.productTitle}」并同意完成交易？`;
                        if (window.confirm(msg)) handleAdvance(order);
                      }} className="mt-4 w-full py-2.5 bg-gradient-to-r from-eco-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" /> {nextLabel(order.status)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
