import { Grid3X3, Laptop, BookOpen, Trophy, Shirt, Home, Bike } from 'lucide-react';
import stats from '../data/stats.json';

const iconMap = {
  Grid3X3, Laptop, BookOpen, Trophy, Shirt, Home, Bike,
};

export default function CategoryNav({ active, onChange }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">分类导航</h3>
        <span className="text-xs text-slate-400">滑动查看更多 →</span>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2.5 pb-1" style={{ minWidth: 'max-content' }}>
          {stats.categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Grid3X3;
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`flex flex-col items-center gap-1.5 min-w-[72px] px-3 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-eco-500 to-eco-700 text-white shadow-lg shadow-eco-500/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-eco-50 hover:text-eco-700 hover:scale-105 border border-slate-200/80 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/20' : 'bg-eco-100'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-eco-600'}`} />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
