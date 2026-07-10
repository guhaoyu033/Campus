import { useState, useEffect } from 'react';
import { X, ShoppingCart, Minus, Plus, Trash2, MapPin, CheckCircle, CreditCard, Truck, Check, ChevronRight, Phone, Package, Star } from 'lucide-react';
import AddressSelector from './AddressSelector.jsx';

export default function CartPage({
  cart,
  products,
  onClose,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
  onSelectProduct,
  onToast,
  addressBook = [],
  selectedAddressId = null,
  onSelectAddressId,
  onAddAddress,
  onCloseAddressModal,
  showAddressModal = false,
  onOpenAddressModal
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [removedCount, setRemovedCount] = useState(0);

  const cartItems = cart.map(item => {
    const p = products.find(x => x.id === item.productId);
    return { ...item, product: p };
  }).filter(item => item.product);

  const validItems = cartItems.filter(item => item.product.status === 'active');
  const invalidItems = cartItems.filter(item => item.product.status !== 'active');

  useEffect(() => {
    if (invalidItems.length > 0) {
      invalidItems.forEach(item => onRemove && onRemove(item.productId));
      setRemovedCount(invalidItems.length);
      if (onToast) onToast(`已自动移除 ${invalidItems.length} 件失效商品`, 'info');
    }
  }, [invalidItems.map(i => i.productId).join(',')]);

  const totalQty = validItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = validItems.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
  const totalSaved = validItems.reduce((sum, i) => sum + (((i.product.originalPrice || i.product.price) - i.product.price) * i.qty), 0);

  const hasAddresses = Array.isArray(addressBook) && addressBook.length > 0;

  const activeSelectedId = (() => {
    if (selectedAddressId) {
      const found = addressBook.find(a => a.id === selectedAddressId);
      if (found) return selectedAddressId;
    }
    if (hasAddresses) {
      const def = addressBook.find(a => a.isDefault);
      if (def) return def.id;
      return addressBook[0].id;
    }
    return null;
  })();

  const selectedAddress = hasAddresses
    ? addressBook.find(a => a.id === activeSelectedId) || null
    : null;

  const buildFullAddressString = (addr) => {
    if (!addr) return '';
    const region = [addr.province, addr.city, addr.district].filter(Boolean).join('');
    const detail = addr.detail || '';
    const receiver = addr.receiver || '';
    const phone = addr.phone || '';
    return `${region}${detail} (${receiver} ${phone})`;
  };

  const handleCheckout = () => {
    if (validItems.length === 0) {
      onToast && onToast('购物车为空，先去挑选心仪商品吧 🛒');
      return;
    }
    if (!selectedAddress) {
      onToast && onToast('请先选择收货地址');
      return;
    }
    const fullAddressString = buildFullAddressString(selectedAddress);
    onCheckout(validItems.map(i => ({ productId: i.productId, qty: i.qty })), fullAddressString);
    onClose();
  };

  const handleSelectAddress = (addr) => {
    if (onAddAddress) {
      onAddAddress(addr);
    }
    if (onCloseAddressModal) {
      onCloseAddressModal();
    }
  };

  const getEmoji = (title) => {
    if (title.includes('iPad') || title.includes('Mac') || title.includes('笔记本')) return '💻';
    if (title.includes('鞋') || title.includes('跑鞋') || title.includes('运动鞋')) return '👟';
    if (title.includes('书') || title.includes('教材') || title.includes('考研')) return '📚';
    if (title.includes('车') || title.includes('滑板')) return '🛴';
    if (title.includes('键盘') || title.includes('鼠标')) return '⌨️';
    if (title.includes('吉他') || title.includes('琴')) return '🎸';
    return '🎁';
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
              <h2 className="font-bold text-slate-900 text-lg">购物车</h2>
              <p className="text-xs text-slate-500">{validItems.length > 0 ? `共 ${totalQty} 件商品` : '购物车空空如也'}</p>
            </div>
          </div>
          {validItems.length > 0 && (
            <button onClick={() => {
              if (window.confirm('确认清空购物车？')) {
                onClear();
                onToast && onToast('购物车已清空');
              }
            }} className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> 清空
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-40">
        {validItems.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
            <div className="text-7xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">购物车空空如也</h3>
            <p className="text-sm text-slate-500 mb-5">去首页逛逛，看看 CampusFlow 为你推荐的好物吧！</p>
            <button onClick={onClose} className="px-5 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/20 hover:shadow-xl transition-all">
              去逛逛 →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {removedCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
                已自动移除 {removedCount} 件失效商品（已售/已下架）
              </div>
            )}
            {validItems.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div onClick={() => onSelectProduct && onSelectProduct(item.product)} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-eco-100 to-emerald-100 flex-shrink-0 overflow-hidden cursor-pointer flex items-center justify-center text-4xl">
                    {item.product.image && item.product.image.startsWith('data:') ? (
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getEmoji(item.product.title)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 onClick={() => onSelectProduct && onSelectProduct(item.product)} className="font-bold text-slate-900 text-base hover:text-eco-600 cursor-pointer truncate">
                        {item.product.title}
                      </h3>
                      {item.product.status !== 'active' && (
                        <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 font-semibold">
                          {item.product.status === 'sold' ? '已售出' : '已下架'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xl font-black text-eco-600">¥{item.product.price}</span>
                      {item.product.originalPrice && item.product.originalPrice !== item.product.price && (
                        <span className="text-xs text-slate-400 line-through">¥{item.product.originalPrice}</span>
                      )}
                    </div>
                    {item.product.category && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mb-3">{item.product.category}</span>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl p-1">
                        <button onClick={() => {
                          if (item.qty <= 1) {
                            if (window.confirm('从购物车中移除？')) onRemove(item.productId);
                          } else {
                            onUpdateQty(item.productId, item.qty - 1);
                          }
                        }} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-eco-600 hover:shadow-sm transition-all">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-800 text-sm">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.productId, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-eco-600 hover:shadow-sm transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">小计</div>
                        <div className="text-lg font-black text-eco-700">¥{(item.product.price * item.qty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-br from-eco-50 to-emerald-50 rounded-3xl p-5 border border-eco-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">商品件数</span>
                <span className="font-bold text-slate-800">{totalQty} 件</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">商品金额</span>
                <span className="font-bold text-slate-800">¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-rose-600">预计节省</span>
                <span className="font-bold text-rose-600">-¥{totalSaved.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-eco-200/60">
                <span className="font-bold text-slate-800">应付总额</span>
                <span className="text-2xl font-black text-eco-700">¥{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-4 shadow-2xl">
          <div className="max-w-5xl mx-auto">
            {!showCheckout ? (
              <button onClick={() => setShowCheckout(true)} className="w-full py-3.5 bg-gradient-to-r from-eco-500 to-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-eco-500/30 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> 立即结算 ({totalQty} 件，¥{totalPrice.toFixed(2)})
              </button>
            ) : (
              <div className="space-y-3 animate-slide-up">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-eco-50 to-emerald-50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-eco-600" />
                      <span className="font-bold text-slate-800 text-sm">选择收货地址</span>
                    </div>
                    <button onClick={() => onOpenAddressModal && onOpenAddressModal()} className="flex items-center gap-1 text-xs text-eco-700 font-semibold hover:text-eco-800 transition-colors">
                      <Package className="w-3.5 h-3.5" /> 管理地址 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-3">
                    {!hasAddresses ? (
                      <div className="py-6 text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 mb-3">还没有添加地址，请添加收货地址</p>
                        <button onClick={() => onOpenAddressModal && onOpenAddressModal()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-xs font-bold shadow-md shadow-eco-500/20 hover:shadow-lg transition-all">
                          <Plus className="w-3.5 h-3.5" /> 添加新地址
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {addressBook.map((addr) => {
                          const isSelected = addr.id === activeSelectedId;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => onSelectAddressId && onSelectAddressId(addr.id)}
                              className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-eco-500 bg-eco-50/50 shadow-sm'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-0.5">
                                  {isSelected ? (
                                    <div className="w-5 h-5 rounded-full bg-eco-500 flex items-center justify-center">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-bold text-slate-900 text-sm">{addr.receiver}</span>
                                    <span className="flex items-center gap-0.5 text-xs text-slate-500">
                                      <Phone className="w-3 h-3" /> {addr.phone}
                                    </span>
                                    {addr.isDefault && (
                                      <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 font-bold border border-amber-200">
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-500" /> 默认
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {[addr.province, addr.city, addr.district].filter(Boolean).join(' ')} {addr.detail}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <button onClick={() => onOpenAddressModal && onOpenAddressModal()} className="w-full mt-1 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-600 font-semibold hover:border-eco-400 hover:text-eco-700 hover:bg-eco-50/30 transition-all flex items-center justify-center gap-1.5">
                          <Plus className="w-4 h-4" /> 添加新地址
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {selectedAddress && (
                  <div className="flex items-start gap-2 p-3 bg-eco-50 rounded-xl text-xs text-eco-800 border border-eco-200/60">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">配送至：</span>
                      <span>{[selectedAddress.province, selectedAddress.city, selectedAddress.district].filter(Boolean).join(' ')} {selectedAddress.detail}</span>
                      <span className="ml-1.5 text-eco-700">({selectedAddress.receiver} {selectedAddress.phone})</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCheckout(false)} className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors">
                    返回
                  </button>
                  <button onClick={handleCheckout} className="flex-1 py-3 bg-gradient-to-r from-eco-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-eco-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> 提交订单 (总价 ¥{totalPrice.toFixed(2)})
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center">
                    <CreditCard className="w-3.5 h-3.5" /> <span>当面付款</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center">
                    <Truck className="w-3.5 h-3.5" /> <span>当面验货</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AddressSelector
        open={showAddressModal}
        onClose={onCloseAddressModal || (() => {})}
        onSelect={handleSelectAddress}
        addressCount={addressBook.length}
        onToast={onToast}
      />
    </div>
  );
}
