import { useState, useEffect } from 'react';
import { X, MapPin, Star, ShieldCheck, Eye, Heart, MessageCircle, ThumbsUp, Clock, Tag, ShoppingCart, Sparkles, MessageSquare, Edit3, CheckCircle, Trash2, ChevronRight } from 'lucide-react';

export default function ProductDetail({ product, seller, relatedProducts = [], user, onClose, onToast, onToggleLike, onAddComment, onToggleCommentLike, onAddToCart, onSelectProduct }) {
  const [liked, setLiked] = useState(product.liked);
  const [tab, setTab] = useState('desc');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');

  const comments = Array.isArray(product.comments) ? product.comments : [];
  const avgRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length).toFixed(1)
    : '0.0';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    setLiked(product.liked);
  }, [product.liked]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleToggleLike = () => {
    setIsAnimating(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setTimeout(() => setIsAnimating(false), 300);
    onToggleLike && onToggleLike(product.id);
    if (newLiked) {
      onToast && onToast('已加入心愿单，价格变动会通知你 💕');
    } else {
      onToast && onToast('已取消收藏');
    }
  };

  const handleAddToCart = () => {
    onAddToCart && onAddToCart(product.id, 1);
  };

  const handleOpenRelated = (rp) => {
    onClose && onClose();
    setTimeout(() => {
      onSelectProduct && onSelectProduct(rp);
    }, 100);
  };

  const handleSubmitComment = () => {
    if (!user) {
      onToast && onToast('请先登录后再发表评论 🔐');
      return;
    }
    if (!newContent.trim()) {
      onToast && onToast('评论内容不能为空哦 ✍️');
      return;
    }
    if (newContent.trim().length > 200) {
      onToast && onToast('评论内容不能超过200字 📝');
      return;
    }
    const comment = {
      id: `c${Date.now()}`,
      userId: user.id,
      userName: user.name,
      rating: newRating,
      content: newContent.trim(),
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onAddComment && onAddComment(product.id, comment);
    setNewContent('');
    setNewRating(5);
    setShowCommentModal(false);
    onToast && onToast('评论发布成功！🎉');
  };

  const handleToggleCommentLike = (commentId) => {
    if (!user) {
      onToast && onToast('请先登录后再点赞 👍');
      return;
    }
    onToggleCommentLike && onToggleCommentLike(product.id, commentId);
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${size} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
    );
  };

  const imageFallback = (e) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={handleBackdropClick}>
      <div className="bg-white w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <div className="aspect-[16/10] sm:aspect-video bg-slate-100 overflow-hidden">
            {product.image && product.image.startsWith('data:') ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" onError={imageFallback} />
            ) : product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" onError={imageFallback} />
            ) : null}
            <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-eco-100 to-emerald-100 text-8xl">
              {product.title.includes('iPad') || product.title.includes('Mac') ? '💻' :
               product.title.includes('鞋') || product.title.includes('跑鞋') ? '👟' :
               product.title.includes('书') || product.title.includes('教材') ? '📚' :
               product.title.includes('车') || product.title.includes('滑板') ? '🛴' :
               product.title.includes('键盘') || product.title.includes('鼠标') ? '⌨️' : '🎁'}
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
            <X className="w-5 h-5 text-slate-700" />
          </button>
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-eco-600 text-white text-sm font-bold shadow-lg shadow-eco-600/30">
            🔥 {product.matchScore || 85}% 精准匹配
          </div>
          {product.status && product.status !== 'active' && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
              {product.status === 'offline' ? '已下架' : product.status === 'sold' ? '已售出' : ''}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{product.title}</h2>
            <button onClick={handleToggleLike} className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isAnimating ? 'scale-90' : 'scale-100'} ${liked ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : 'border-slate-200 text-slate-400 hover:border-rose-300 hover:bg-rose-50'}`}>
              <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'fill-current scale-110' : ''}`} />
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-eco-600">¥{product.price}</span>
            {product.originalPrice && <span className="text-sm text-slate-400 line-through">¥{product.originalPrice}</span>}
            {product.originalPrice && product.price !== product.originalPrice && (
              <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-semibold">
                省 ¥{product.originalPrice - product.price}
              </span>
            )}
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            {product.category && <span className="px-2.5 py-1 bg-eco-50 text-eco-700 rounded-lg text-xs font-medium"><Tag className="w-3 h-3 inline mr-1" />{product.category}</span>}
            {product.condition && <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">{product.condition}</span>}
            {product.location && <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"><MapPin className="w-3 h-3 inline mr-1" />{product.location}</span>}
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"><Clock className="w-3 h-3 inline mr-1" />{product.publishedAt || '刚刚'}</span>
          </div>

          <div className="flex gap-2 border-b border-slate-200 mb-5 overflow-x-auto">
            <button onClick={() => setTab('desc')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === 'desc' ? 'border-eco-600 text-eco-700' : 'border-transparent text-slate-500'}`}>商品详情</button>
            <button onClick={() => setTab('comments')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === 'comments' ? 'border-eco-600 text-eco-700' : 'border-transparent text-slate-500'}`}>
              用户评论 {comments.length > 0 && <span className="text-xs ml-0.5">({comments.length})</span>}
            </button>
            <button onClick={() => setTab('seller')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === 'seller' ? 'border-eco-600 text-eco-700' : 'border-transparent text-slate-500'}`}>卖家信息</button>
            {relatedProducts.length > 0 && <button onClick={() => setTab('related')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === 'related' ? 'border-eco-600 text-eco-700' : 'border-transparent text-slate-500'}`}>相关推荐</button>}
          </div>

          {tab === 'desc' && (
            <div className="animate-fade-in">
              <div className="flex gap-6 mb-5 p-4 bg-eco-50/50 rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><Eye className="w-4 h-4" /><span className="font-bold text-lg">{product.views || 0}</span></div>
                  <div className="text-xs text-slate-500">浏览</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><Heart className={`w-4 h-4 ${liked ? 'text-rose-500 fill-rose-500' : ''}`} /><span className="font-bold text-lg">{product.likes || 0}</span></div>
                  <div className="text-xs text-slate-500">收藏</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><ThumbsUp className="w-4 h-4" /><span className="font-bold text-lg">{product.matchScore || 85}%</span></div>
                  <div className="text-xs text-slate-500">匹配度</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-800"><MessageSquare className="w-4 h-4" /><span className="font-bold text-lg">{comments.length}</span></div>
                  <div className="text-xs text-slate-500">评论</div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{product.description || '商品详细描述待补充，卖家会尽快完善。'}</p>

              <div className="mt-5 p-4 bg-gradient-to-r from-eco-50 to-emerald-50 rounded-2xl border border-eco-200/60">
                <div className="text-xs text-eco-700 font-semibold mb-1">💡 匹配说明</div>
                <div className="text-sm text-slate-600">{product.matchFactor || '基于浏览偏好与历史行为，由 CampusFlow 智能匹配算法推荐'}</div>
              </div>
            </div>
          )}

          {tab === 'comments' && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-br from-eco-50 to-emerald-50 rounded-2xl p-5 mb-5 border border-eco-200/60">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-eco-700">{avgRating}</div>
                      <div className="mt-1">{renderStars(Math.round(parseFloat(avgRating)))}</div>
                      <div className="text-xs text-slate-500 mt-1">{comments.length} 条评论</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCommentModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    写评论
                  </button>
                </div>
              </div>

              {comments.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">还没有评论</h3>
                  <p className="text-sm text-slate-500 mb-5">快来抢沙发，成为第一个评论的人吧！</p>
                  <button
                    onClick={() => setShowCommentModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    写下第一条评论
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {(comment.userName || 'U').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800 text-sm">{comment.userName}</span>
                              {renderStars(comment.rating, 'w-3.5 h-3.5')}
                            </div>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 mt-2 leading-relaxed">{comment.content}</p>
                          {comment.sellerReply && (
                            <div className="mt-3 p-3 bg-eco-50/70 rounded-xl border border-eco-200/50">
                              <div className="text-xs text-eco-700 font-semibold mb-1 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                卖家回复
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{comment.sellerReply}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-end mt-2">
                            <button
                              onClick={() => handleToggleCommentLike(comment.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                                comment.liked
                                  ? 'bg-eco-100 text-eco-700'
                                  : 'bg-slate-100 text-slate-500 hover:bg-eco-50 hover:text-eco-700'
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${comment.liked ? 'fill-current' : ''}`} />
                              <span className="font-semibold">{comment.likes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'seller' && seller && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/60">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                  {seller.name ? seller.name.charAt(0) : 'S'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{seller.name || '卖家同学'}</span>
                    <ShieldCheck className="w-4 h-4 text-eco-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{seller.school || user?.school || '浙江大学'}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-4 bg-eco-50 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-eco-700 font-bold text-xl"><Star className="w-4 h-4" fill="currentColor" />{seller.creditScore || 90}</div>
                  <div className="text-[11px] text-slate-500 mt-1">信用评分</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <div className="text-slate-800 font-bold text-xl">{seller.tradeCount || 3}</div>
                  <div className="text-[11px] text-slate-500 mt-1">成功交易</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl text-center">
                  <div className="text-amber-700 font-bold text-xl flex items-center justify-center"><ShieldCheck className="w-4 h-4 mr-1" />已认证</div>
                  <div className="text-[11px] text-slate-500 mt-1">校园身份</div>
                </div>
              </div>

              <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-xl">
                ⚠️ 温馨提示：建议校园当面交易，检查物品成色后再付款，保障双方权益。
              </div>
            </div>
          )}

          {tab === 'related' && relatedProducts.length > 0 && (
            <div className="animate-fade-in grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rp) => (
                <div key={rp.id} onClick={() => handleOpenRelated(rp)} className="cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="aspect-square bg-gradient-to-br from-eco-100 to-emerald-100 flex items-center justify-center text-4xl">
                    {rp.image && rp.image.startsWith('data:') ? (
                      <img src={rp.image} alt={rp.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>{rp.title.includes('iPad') || rp.title.includes('Mac') ? '💻' : rp.title.includes('鞋') || rp.title.includes('跑鞋') ? '👟' : rp.title.includes('书') || rp.title.includes('教材') ? '📚' : '🎁'}</span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-semibold text-slate-900 truncate mb-1">{rp.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-eco-600">¥{rp.price}</span>
                      <span className="text-[10px] text-slate-400">{rp.matchScore || 85}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 bg-white flex gap-2.5">
          <button onClick={handleToggleLike} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ${liked ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/25' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'}`}>
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {liked ? '已收藏' : '我想要'}
          </button>
          <button onClick={handleAddToCart} className="flex-[1.2] flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <ShoppingCart className="w-4 h-4" /> 加入购物车
          </button>
          <button onClick={() => onToast && onToast('已为您打开私信通道，正在连接卖家... ✉️')} className="flex-[1.3] flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 text-white font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <MessageCircle className="w-4 h-4" /> 一键私信
          </button>
        </div>
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={() => setShowCommentModal(false)}>
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-eco-600" />
                发表评论
              </h3>
              <button onClick={() => setShowCommentModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {!user ? (
                <div className="py-10 text-center bg-slate-50 rounded-2xl">
                  <div className="text-5xl mb-4">🔐</div>
                  <h4 className="text-base font-bold text-slate-700 mb-2">请先登录</h4>
                  <p className="text-sm text-slate-500 mb-5">登录后才能发表评论哦</p>
                  <button
                    onClick={() => {
                      onToast && onToast('请先登录账号 🔐');
                      setShowCommentModal(false);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl transition-all"
                  >
                    知道了
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">商品评分</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() => setNewRating(i)}
                          className="p-1 transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star className={`w-8 h-8 ${i <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-slate-500">
                        {newRating === 5 ? '非常满意' : newRating === 4 ? '比较满意' : newRating === 3 ? '一般' : newRating === 2 ? '不太满意' : '非常不满'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      评论内容
                      <span className="text-xs text-slate-400 font-normal ml-2">（最多 200 字）</span>
                    </label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value.slice(0, 200))}
                      placeholder="分享一下你的使用体验、购买建议或与卖家的交易感受吧..."
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-eco-400 focus:bg-white focus:ring-2 focus:ring-eco-100/50 outline-none transition-all resize-none placeholder:text-slate-400"
                    />
                    <div className="flex justify-end mt-2">
                      <span className={`text-xs ${newContent.length >= 200 ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>
                        {newContent.length}/200
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200/50">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      请文明发言，拒绝辱骂、广告、虚假评论。优质评论会被置顶哦～
                    </p>
                  </div>
                </>
              )}
            </div>

            {user && (
              <div className="p-5 border-t border-slate-200">
                <button
                  onClick={handleSubmitComment}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 text-white font-semibold text-sm shadow-lg shadow-eco-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  发布评论
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
