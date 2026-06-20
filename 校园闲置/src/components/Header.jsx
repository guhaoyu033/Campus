import { useState } from 'react';
import { Leaf, BarChart3, Bell, MessageSquare, Heart, TrendingUp, Check, ShoppingBag, AlertCircle, X, LogOut, User, GraduationCap } from 'lucide-react';

export default function Header({ onOpenDashboard, user, onLogin, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, icon: Heart, title: '你的收藏有新出价', text: 'iPad Air 5 有人出价 ¥2600', time: '2 分钟前', color: 'text-pink-500 bg-pink-50', unread: true },
    { id: 2, icon: MessageSquare, title: '新的私信', text: '张同学：这个教材你还要吗？', time: '15 分钟前', color: 'text-blue-500 bg-blue-50', unread: true },
    { id: 3, icon: TrendingUp, title: '智能匹配 · 高相关商品', text: '为你匹配到 3 件你可能感兴趣的物品', time: '1 小时前', color: 'text-emerald-500 bg-emerald-50', unread: true },
    { id: 4, icon: Check, title: '交易提醒', text: '恭喜！你的 AirPods Pro 已被预订', time: '3 小时前', color: 'text-amber-500 bg-amber-50', unread: false },
    { id: 5, icon: ShoppingBag, title: '系统公告', text: '毕业季闲置清仓活动已开启，限时一周', time: '昨天', color: 'text-slate-500 bg-slate-100', unread: false },
    { id: 6, icon: AlertCircle, title: '信用提示', text: '您的信用等级已升级到 A+，感谢诚信交易', time: '2 天前', color: 'text-emerald-500 bg-emerald-50', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

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

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 hover:text-eco-600 hover:bg-eco-50 rounded-xl transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">数据看板</span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-eco-600 hover:bg-eco-50 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-eco-50 to-white">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">消息通知</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {unreadCount} 条未读 · 智能匹配系统实时推送
                      </div>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 p-3.5 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer ${n.unread ? 'bg-eco-50/30' : ''}`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                            <Icon style={{ width: '18px', height: '18px' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900 truncate">{n.title}</span>
                              {n.unread && (
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{n.text}</div>
                            <div className="text-[10px] text-slate-400 mt-1.5">{n.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button className="w-full py-2 text-xs font-medium text-eco-700 hover:text-eco-800 hover:bg-white rounded-xl transition-colors">
                      查看全部消息 →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pr-2 text-slate-700 hover:text-eco-600 hover:bg-eco-50 rounded-xl transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg bg-eco-100"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-semibold truncate max-w-[80px]">{user.name || '用户'}</span>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-12 w-[280px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
                    <div className="p-4 bg-gradient-to-br from-eco-500 to-emerald-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{user.name || '用户'}</div>
                          <div className="text-xs text-white/80 truncate">{user.email || ''}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-1">
                      <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 bg-slate-50 rounded-xl">
                        <GraduationCap className="w-4 h-4 text-eco-600" />
                        <span>{user.school || '未填写学校'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-1">
                          <span className="text-eco-600 font-bold">信用评分：{user.creditScore || '—'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 bg-slate-50 rounded-xl">
                        <span className="text-slate-500">累计交易：</span>
                        <span className="font-bold text-eco-700">{user.tradeCount || 0} 次</span>
                      </div>
                    </div>

                    <div className="p-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white rounded-xl shadow-sm shadow-eco-500/20 text-sm font-semibold transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">登录</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
