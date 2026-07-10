import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useClickOutside } from '../hooks/useUtils';

const popularSearches = ['iPad', '教材', '考研', '运动鞋', '笔记本', '相机', '自行车', '吉他'];

export default function SearchBar({ value, onChange, compact = false, products = [] }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setShowSuggestions(false));

  const suggestions = useMemo(() => {
    if (!value.trim()) return popularSearches.slice(0, 6);
    const lowerValue = value.toLowerCase();
    const productSuggestions = products
      .filter(p => 
        p.title.toLowerCase().includes(lowerValue) || 
        p.category.toLowerCase().includes(lowerValue)
      )
      .map(p => p.title)
      .slice(0, 4);
    const categorySuggestions = [...new Set(
      products.filter(p => p.category.toLowerCase().includes(lowerValue)).map(p => p.category)
    )].slice(0, 2);
    return [...productSuggestions, ...categorySuggestions];
  }, [value, products]);

  useEffect(() => {
    setShowSuggestions(value.length > 0);
    setActiveSuggestionIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
        e.preventDefault();
        onChange(suggestions[activeSuggestionIndex]);
        setShowSuggestions(false);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, activeSuggestionIndex, onChange]);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${compact ? '' : 'max-w-2xl'}`}>
      <div className={`flex items-center bg-white rounded-2xl shadow-lg ${compact ? 'shadow-sm' : ''} border-2 border-transparent focus-within:border-eco-400 focus-within:shadow-eco-200/60 ${compact ? '' : ''}`}>
        <Search className={`w-5 h-5 ml-4 ${compact ? 'text-slate-400' : 'text-eco-500'}`} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索闲置物品：iPad、教材、自行车、吉他..."
          className="flex-1 px-3 py-3.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
          onFocus={() => setShowSuggestions(true)}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-2 mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:rotate-90"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  index === activeSuggestionIndex 
                    ? 'bg-eco-50 text-eco-700' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>{suggestion}</span>
                {popularSearches.includes(suggestion) && (
                  <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">热门</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
