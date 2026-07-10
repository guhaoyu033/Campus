export function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="w-24 h-24 bg-slate-200 rounded-2xl" />
      </div>
      <div className="p-4">
        <div className="h-5 bg-slate-200 rounded-lg mb-3" />
        <div className="h-4 bg-slate-100 rounded mb-2" />
        <div className="flex items-center gap-2">
          <div className="h-6 bg-eco-100 rounded-lg w-16" />
          <div className="h-4 bg-slate-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-200 rounded ${
            i === 0 ? 'w-full' : i === 1 ? 'w-3/4' : 'w-1/2'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonButton() {
  return (
    <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
  );
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  return (
    <div className={`${sizes[size]} bg-slate-200 rounded-full animate-pulse`} />
  );
}
