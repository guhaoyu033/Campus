import { Plus } from 'lucide-react';

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="发布闲置物品"
    >
      <div className="absolute inset-0 bg-eco-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-eco-500 to-eco-700 shadow-2xl shadow-eco-500/40 flex flex-col items-center justify-center text-white hover:scale-110 transition-transform active:scale-95">
        <Plus className="w-7 h-7" strokeWidth={2.5} />
        <span className="text-[10px] font-medium mt-0.5">发布</span>
      </div>
    </button>
  );
}
