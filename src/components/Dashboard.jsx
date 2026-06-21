import { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { X, Leaf, Trees, TrendingUp, Package, Zap, Target, Users, Sparkles, BarChart3, Check, Clock } from 'lucide-react';
import stats from '../data/stats.json';

export default function Dashboard({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const statusColorMap = {
    '已完成': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '进行中': 'bg-amber-50 text-amber-700 border-amber-200',
    '待确认': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gradient-to-b from-slate-50/80 to-white w-full sm:max-w-5xl sm:rounded-3xl rounded-t-3xl max-h-[94vh] overflow-hidden shadow-2xl animate-slide-up backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-lg shadow-eco-500/30">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">校园流转数据中心</h2>
              <p className="text-xs text-slate-500">CampusFlow Analytics · 用户画像聚类分析</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:shadow-md border border-white/50"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8" style={{ maxHeight: 'calc(94vh - 73px)' }}>
          {/* 累计减碳 - 大字号统计 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eco-600 via-eco-500 to-emerald-400 p-6 sm:p-8 text-white shadow-xl shadow-eco-500/30 mb-5">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-white/90 mb-3">
                <Sparkles className="w-4 h-4" /> 基于用户行为大数据的智能匹配
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl sm:text-7xl font-black tracking-tight drop-shadow-sm bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {stats.carbonStats.totalReduced.toLocaleString()}
                </span>
                <span className="text-2xl font-semibold text-white/80">{stats.carbonStats.unit}</span>
              </div>
              <p className="text-sm text-white/90 mb-5">累计减碳量 · 让每一件闲置物品焕发新生</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Trees className="w-4 h-4" /> 相当于种下 <span className="font-bold mx-1">{stats.carbonStats.equivalentTrees}</span> 棵树
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Package className="w-4 h-4" /> 累计流转 <span className="font-bold mx-1">{stats.carbonStats.totalItems.toLocaleString()}</span> 件闲置物品
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" /> 本周 <span className="font-bold mx-1">{stats.carbonStats.weeklyTransactions.toLocaleString()}</span> 笔供需匹配
                </div>
              </div>
            </div>
          </div>

          {/* KPI 统计卡 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <KpiCard icon={<Users className="w-4 h-4" />} label="累计用户" value={stats.kpiData[0].value} growth={stats.kpiData[0].growth} color="blue" />
            <KpiCard icon={<Package className="w-4 h-4" />} label="在售商品" value={stats.kpiData[1].value} growth={stats.kpiData[1].growth} color="eco" />
            <KpiCard icon={<Zap className="w-4 h-4" />} label="今日交易" value={stats.kpiData[2].value} growth={stats.kpiData[2].growth} color="amber" />
            <KpiCard icon={<Target className="w-4 h-4" />} label="平均单价" value={stats.kpiData[3].value} growth={stats.kpiData[3].growth} color="rose" />
          </div>

          {/* 图表区 - 第一排 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">本周热门品类 TOP5</h3>
                  <p className="text-xs text-slate-500 mt-0.5">各品类交易量分布</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-eco-50 text-eco-700 rounded-full font-semibold">柱状图</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.hotCategories} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} formatter={(value) => [`${value} 笔`, '交易量']} cursor={{ fill: '#f0fdf4' }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
                      {stats.hotCategories.map((entry, index) => (
                        <rect key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">交易活跃时段</h3>
                  <p className="text-xs text-slate-500 mt-0.5">一天 24 小时用户活跃度分布</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">趋势</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.activeHours} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}:00`} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} formatter={(value) => [`${value} 笔`, '交易量']} />
                    <Line type="monotone" dataKey="transactions" name="交易量" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#15803d', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 图表区 - 第二排 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">用户画像聚类</h3>
                  <p className="text-xs text-slate-500 mt-0.5">基于行为数据自动识别的核心用户群体</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-rose-50 text-rose-700 rounded-full font-semibold">聚类分析</span>
              </div>
              <div className="h-64 flex items-center">
                <div className="w-1/2 h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.userPersonas}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                      >
                        {stats.userPersonas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} formatter={(value) => [`${value} 人`, '用户数']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2 pl-4">
                  {stats.userPersonas.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-slate-700 truncate flex-1">{p.name}</span>
                      <span className="font-bold text-slate-900">{p.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">本周活跃度趋势</h3>
                  <p className="text-xs text-slate-500 mt-0.5">浏览、收藏、私信数据对比</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold">实时</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.weeklyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={45} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="views" name="浏览量" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
                    <Line type="monotone" dataKey="likes" name="收藏数" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#fbbf24', r: 4 }} />
                    <Line type="monotone" dataKey="messages" name="私信数" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#f87171', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 近期交易记录表 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-md mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">近期交易记录</h3>
                <p className="text-xs text-slate-500 mt-0.5">实时更新的平台交易流水</p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-semibold">最近 24 小时</span>
            </div>

            {/* 桌面端表格 */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">商品</th>
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">卖家</th>
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">买家</th>
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">品类</th>
                    <th className="py-3 px-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">价格</th>
                    <th className="py-3 px-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                    <th className="py-3 px-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((t, idx) => (
                    <tr key={t.id} className={`border-b border-slate-50 hover:bg-eco-50/30 transition-colors ${idx % 2 === 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className="py-3 px-3 font-medium text-slate-800 truncate max-w-[180px]">{t.product}</td>
                      <td className="py-3 px-3 text-slate-600">{t.seller}</td>
                      <td className="py-3 px-3 text-slate-600">{t.buyer}</td>
                      <td className="py-3 px-3 text-slate-600 text-xs">{t.category}</td>
                      <td className="py-3 px-3 text-right font-bold text-eco-700">¥{t.price}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColorMap[t.status]}`}>
                          {t.status === '已完成' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-xs text-slate-400">{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 移动端卡片列表 */}
            <div className="sm:hidden space-y-3">
              {stats.recentTransactions.slice(0, 6).map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{t.product}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.seller} → {t.buyer}</p>
                    </div>
                    <span className={`ml-2 flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${statusColorMap[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{t.category}</span>
                    <span className="font-bold text-eco-700">¥{t.price}</span>
                    <span className="text-slate-400">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部提示 */}
          <div className="p-4 bg-gradient-to-r from-eco-50 to-emerald-50 rounded-2xl border border-eco-200/60 text-center">
            <p className="text-sm text-eco-800 font-medium mb-1">
              🌱 基于用户行为大数据的智能流转平台
            </p>
            <p className="text-xs text-eco-700/80">
              用户画像聚类 · 供需匹配算法 · 数据可视化分析 · 助力校园循环经济
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, growth, color }) {
  const colorMap = {
    blue: 'from-blue-50 to-white text-blue-700 border-blue-100',
    rose: 'from-rose-50 to-white text-rose-700 border-rose-100',
    amber: 'from-amber-50 to-white text-amber-700 border-amber-100',
    eco: 'from-eco-50 to-white text-eco-700 border-eco-200',
  };
  const growthColor = {
    blue: 'text-blue-600 bg-blue-100/70',
    rose: 'text-rose-600 bg-rose-100/70',
    amber: 'text-amber-600 bg-amber-100/70',
    eco: 'text-emerald-600 bg-emerald-100/70',
  };
  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${colorMap[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold opacity-80">
          {icon} {label}
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${growthColor[color]}`}>
          {growth}
        </span>
      </div>
      <div className="text-2xl sm:text-3xl font-black tracking-tight">{value}</div>
    </div>
  );
}
