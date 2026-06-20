import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelect }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="text-6xl mb-4">🔍</div>
        <div className="text-slate-700 font-semibold mb-1">暂无相关闲置</div>
        <div className="text-sm text-slate-500">换个关键词试试，或发布你的闲置吧</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product, idx) => (
        <div
          key={product.id}
          style={{ animationDelay: `${idx * 40}ms` }}
          className="animate-slide-up"
        >
          <ProductCard product={product} onClick={() => onSelect(product)} />
        </div>
      ))}
    </div>
  );
}
