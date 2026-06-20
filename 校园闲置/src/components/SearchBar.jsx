import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, compact = false }) {
  return (
    <div className={`relative ${compact ? '' : 'max-w-2xl'}`}>
      <div className={`flex items-center bg-white rounded-2xl shadow-lg ${compact ? 'shadow-sm' : ''} border border-white/30`}>
        <Search className={`w-5 h-5 ml-4 ${compact ? 'text-slate-400' : 'text-eco-500'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索闲置物品：iPad、教材、自行车、吉他..."
          className="flex-1 px-3 py-3.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-2 mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
