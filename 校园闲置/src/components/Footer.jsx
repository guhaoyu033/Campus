import { Leaf } from 'lucide-react';

export default function Footer({ onOpenDashboard }) {
  return (
    <footer className="mt-12 border-t border-slate-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">校园智转 CampusFlow</div>
              <div className="text-xs text-slate-500">让闲置物品智能流转，让校园更绿色 🌱</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button onClick={onOpenDashboard} className="hover:text-eco-600 transition-colors">数据看板</button>
            <span>·</span>
            <span>2024 CampusFlow Demo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
