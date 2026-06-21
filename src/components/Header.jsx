import { useState, useMemo } from 'react';
import { Leaf, BarChart3, Bell, MessageSquare, Heart, Check, ShoppingBag, Package, User, GraduationCap, LogOut, MoreHorizontal, Trash2, CheckCircle, Circle, Edit3, MapPin } from 'lucide-react';
import messagesData from '../data/messages.json';

export default function Header({ onOpenDashboard, onOpenProfile, onOpenListings, onOpenFavorites, onOpenCart, onOpenOrders, cartCount, ordersCount, user, onLogin, onLogout, onOpenChat, dynamicChats = [], showNotifications: externalShowNotifications, onCloseNotifications: externalOnCloseNotifications }) {
  const [showNotificationsInternal, setShowNotificationsInternal] = useState(false);
  const showNotifications = externalShowNotifications !== undefined ? externalShowNotifications : showNotificationsInternal;
  const setShowNotifications = externalOnCloseNotifications !== undefined
    ? externalOnCloseNotifications
    : setShowNotificationsInternal;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [view, setView] = useState('notifications');
  const [editMode, setEditMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [notifications, setNotifications] = useState(messagesData.notifications);
  const [chats, setChats] = useState(messagesData.chats);

  // 合并静态聊天与动态聊天（动态聊天优先级更高，避免 ID 冲突）
  const allChats = useMemo(() => {
    const staticIds = new Set(messagesData.chats.map(c => c.id));
    const merged = [...messagesData.chats];
    dynamicChats.forEach(dc => {
      if (!staticIds.has(dc.id)) merged.push(dc);
    });
    return merged;
  }, [dynamicChats]);

  const unreadNotifications = notifications.filter((n) => n.unread).length;
  const unreadChats = allChats.filter((c) => c.unread).length;
  const totalUnread = (user ? unreadNotifications : 0) + unreadChats;

  const toggleNotificationSelect = (id) => {
    setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleChatSelect = (id) => {
    setSelectedChats((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const deleteSelectedNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
    setEditMode(false);
  };

  const deleteSelectedChats = () => {
    setChats((prev) => prev.filter((c) => !selectedChats.includes(c.id)));
    setSelectedChats([]);
    setEditMode(false);
  };

  const deleteSingleNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteSingleChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-md shadow-eco-500/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-tight">校园智转</div>
            <div className="text-[10px] text-slate-500 leading-tight">CampusFlow · 智能匹配</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 mr-2">
          <button onClick={onOpenDashboard} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-eco-700 hover:bg-eco-50 rounded-xl transition-colors">
            <BarChart3 className="w-4 h-4" /> 数据看板
          </button>
          {user && (
            <>
              <button onClick={onOpenListings} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-eco-700 hover:bg-eco-50 rounded-xl transition-colors">
                <Package className="w-4 h-4" /> 我的发布
              </button>
              <button onClick={onOpenFavorites} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-eco-700 hover:bg-eco-50 rounded-xl transition-colors">
                <Heart className="w-4 h-4" /> 我的收藏
              </button>
              <button onClick={onOpenCart} className="relative flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-eco-700 hover:bg-eco-50 rounded-xl transition-colors">
                <ShoppingBag className="w-4 h-4" /> 购物车
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={onOpenOrders} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-eco-700 hover:bg-eco-50 rounded-xl transition-colors">
                <Package className="w-4 h-4" /> 我的订单
                {ordersCount > 0 && <span className="text-[10px] font-bold text-eco-700 bg-eco-100 px-1.5 py-0.5 rounded ml-1">{ordersCount}</span>}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                  setView('notifications');
                  if (editMode) setEditMode(false);
                }}
                className="relative p-2 text-slate-600 hover:text-eco-600 hover:bg-eco-50 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                {totalUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationPanel
                  view={view}
                  setView={setView}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  notifications={notifications}
                  chats={allChats}
                  selectedNotifications={selectedNotifications}
                  selectedChats={selectedChats}
                  toggleNotificationSelect={toggleNotificationSelect}
                  toggleChatSelect={toggleChatSelect}
                  deleteSelectedNotifications={deleteSelectedNotifications}
                  deleteSelectedChats={deleteSelectedChats}
                  deleteSingleNotification={deleteSingleNotification}
                  deleteSingleChat={deleteSingleChat}
                  unreadNotifications={unreadNotifications}
                  unreadChats={unreadChats}
                  onClose={() => setShowNotifications(false)}
                  onOpenChat={onOpenChat}
                />
              )}
            </div>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pr-2 text-slate-700 hover:text-eco-600 hover:bg-eco-50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-semibold truncate max-w-[80px]">{user.name || '用户'}</span>
              </button>

              {showUserMenu && (
                <UserMenu
                  user={user}
                  onClose={() => setShowUserMenu(false)}
                  onOpenProfile={() => { setShowUserMenu(false); onOpenProfile && onOpenProfile(); }}
                  onOpenListings={() => { setShowUserMenu(false); onOpenListings && onOpenListings(); }}
                  onOpenFavorites={() => { setShowUserMenu(false); onOpenFavorites && onOpenFavorites(); }}
                  onOpenDashboard={() => { setShowUserMenu(false); onOpenDashboard && onOpenDashboard(); }}
                  onLogout={() => { onLogout(); setShowUserMenu(false); }}
                />
              )}
            </div>
          ) : (
            <button onClick={onLogin} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-br from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white rounded-xl shadow-sm shadow-eco-500/20 text-sm font-semibold transition-all">
              <User className="w-4 h-4" /> <span className="hidden sm:inline">登录</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function NotificationPanel({ view, setView, editMode, setEditMode, notifications, chats, selectedNotifications, selectedChats, toggleNotificationSelect, toggleChatSelect, deleteSelectedNotifications, deleteSelectedChats, deleteSingleNotification, deleteSingleChat, unreadNotifications, unreadChats, onClose, onOpenChat }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-eco-50 to-white">
          {editMode ? (
            <>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditMode(false)} className="p-1.5 hover:bg-white rounded-lg text-slate-500 transition-colors">
                  <span className="text-xs">✕ 取消</span>
                </button>
                <div className="font-bold text-slate-900 text-sm">已选择 {view === 'notifications' ? selectedNotifications.length : selectedChats.length} 项</div>
              </div>
              <button
                onClick={view === 'notifications' ? deleteSelectedNotifications : deleteSelectedChats}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-md transition-all"
              >
                <Trash2 className="w-4 h-4" /> 删除
              </button>
            </>
          ) : (
            <>
              <div>
                <div className="font-bold text-slate-900 text-sm">消息中心</div>
                <div className="text-xs text-slate-500 mt-0.5">{totalUnreadFn(unreadNotifications, unreadChats, view) > 0 ? `${totalUnreadFn(unreadNotifications, unreadChats, view)} 条未读消息` : '暂无新消息'}</div>
              </div>
              <button onClick={() => setEditMode(true)} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-eco-700 transition-colors" title="编辑模式">
                <Edit3 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex border-b border-slate-100">
          <button onClick={() => setView('notifications')} className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${view === 'notifications' ? 'text-eco-700 border-b-2 border-eco-600' : 'text-slate-500 hover:text-slate-700'}`}>
            通知 {unreadNotifications > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full">{unreadNotifications}</span>}
          </button>
          <button onClick={() => setView('chats')} className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${view === 'chats' ? 'text-eco-700 border-b-2 border-eco-600' : 'text-slate-500 hover:text-slate-700'}`}>
            私信 {unreadChats > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full">{unreadChats}</span>}
          </button>
        </div>

        {view === 'notifications' && (
          <div className="max-h-[380px] overflow-y-auto">
            {editMode && (
              <div onClick={() => {
                if (selectedNotifications.length === notifications.length && notifications.length > 0) {
                  // deselect all
                  notifications.forEach((n) => toggleNotificationSelect(n.id));
                } else {
                  notifications.forEach((n) => {
                    if (!selectedNotifications.includes(n.id)) toggleNotificationSelect(n.id);
                  });
                }
              }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                {selectedNotifications.length === notifications.length && notifications.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-eco-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-medium text-slate-700">全选</span>
              </div>
            )}
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Bell className="w-12 h-12 mb-3 opacity-30" />
                <span className="text-sm">暂无通知</span>
              </div>
            ) : (
              notifications.map((n) => {
                const isSelected = selectedNotifications.includes(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (editMode) toggleNotificationSelect(n.id);
                      else onClose();
                    }}
                    className={`flex items-start gap-3 p-3.5 border-b border-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-eco-50/60' : n.unread ? 'bg-eco-50/30 hover:bg-eco-50/50' : 'hover:bg-slate-50/80'}`}
                  >
                    {editMode && (
                      <div className="flex items-center pt-0.5">
                        {isSelected ? <CheckCircle className="w-5 h-5 text-eco-600" /> : <Circle className="w-5 h-5 text-slate-300" />}
                      </div>
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 truncate">{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">{n.text}</div>
                      <div className="text-[10px] text-slate-400 mt-1.5">{n.time}</div>
                    </div>
                    {!editMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSingleNotification(n.id); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {view === 'chats' && (
          <div className="max-h-[380px] overflow-y-auto">
            {editMode && (
              <div onClick={() => {
                if (selectedChats.length === chats.length && chats.length > 0) {
                  chats.forEach((c) => toggleChatSelect(c.id));
                } else {
                  chats.forEach((c) => {
                    if (!selectedChats.includes(c.id)) toggleChatSelect(c.id);
                  });
                }
              }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                {selectedChats.length === chats.length && chats.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-eco-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-medium text-slate-700">全选</span>
              </div>
            )}
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                <span className="text-sm">暂无私信消息</span>
              </div>
            ) : (
              chats.map((chat) => {
                const isSelected = selectedChats.includes(chat.id);
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      if (editMode) toggleChatSelect(chat.id);
                      else {
                        onOpenChat && onOpenChat(chat.id);
                        onClose();
                      }
                    }}
                    className={`flex items-start gap-3 p-3.5 border-b border-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-eco-50/60' : chat.unread ? 'bg-eco-50/30 hover:bg-eco-50/50' : 'hover:bg-slate-50/80'}`}
                  >
                    {editMode && (
                      <div className="flex items-center pt-1.5">
                        {isSelected ? <CheckCircle className="w-5 h-5 text-eco-600" /> : <Circle className="w-5 h-5 text-slate-300" />}
                      </div>
                    )}
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-eco-100 to-emerald-100 flex items-center justify-center text-eco-700 font-bold">
                        {chat.name ? chat.name.charAt(0) : 'U'}
                      </div>
                      {chat.unread && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 truncate">{chat.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{chat.time}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{chat.lastMessage}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {chat.product && <span className="text-[10px] text-eco-600 bg-eco-50 px-1.5 py-0.5 rounded">{chat.product}</span>}
                      </div>
                    </div>
                    {!editMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSingleChat(chat.id); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}

function totalUnreadFn(unreadNotifications, unreadChats, view) {
  if (view === 'notifications') return unreadNotifications;
  if (view === 'chats') return unreadChats;
  return unreadNotifications + unreadChats;
}

function UserMenu({ user, onClose, onOpenProfile, onOpenListings, onOpenFavorites, onOpenDashboard, onLogout }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-[260px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
        <div onClick={onOpenProfile} className="p-4 bg-gradient-to-br from-eco-500 to-emerald-600 text-white cursor-pointer hover:from-eco-600 hover:to-emerald-700 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{user.name || '用户'}</div>
              <div className="text-xs text-white/80 truncate">{user.email || ''}</div>
            </div>
            <Edit3 className="w-4 h-4 text-white/70" />
          </div>
        </div>

        <div className="p-2">
          <button onClick={onOpenListings} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <Package className="w-4 h-4 text-eco-600" /> 我的发布 <span className="ml-auto text-[10px] text-slate-400">›</span>
          </button>
          <button onClick={onOpenFavorites} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <Heart className="w-4 h-4 text-pink-500" /> 我的收藏 <span className="ml-auto text-[10px] text-slate-400">›</span>
          </button>
          <button onClick={onOpenDashboard} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <BarChart3 className="w-4 h-4 text-blue-600" /> 数据看板 <span className="ml-auto text-[10px] text-slate-400">›</span>
          </button>
        </div>

        <div className="p-2 border-t border-slate-100">
          <div className="px-3 py-2 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-eco-600" /><span>{user.school || '我的学校'}</span></span>
            <span className="font-bold text-eco-700">信用：{user.creditScore || '—'}</span>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold text-sm transition-colors">
            <LogOut className="w-4 h-4" /> 退出登录
          </button>
        </div>
      </div>
    </>
  );
}
