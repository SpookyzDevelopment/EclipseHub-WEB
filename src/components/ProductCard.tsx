import { ProductWithSale } from '../services/dataService';
import { ShoppingCart, Check, Tag, Sparkles, Star, Percent } from 'lucide-react';
import { addToCart } from '../utils/cart';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image+Available';

interface ProductCardProps {
  product: ProductWithSale;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const getImageUrl = () => {
    if (!product.image_url) return FALLBACK_IMAGE;

    if (product.image_url.startsWith('http')) {
      return product.image_url;
    } else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(product.image_url);
      return data?.publicUrl || FALLBACK_IMAGE;
    }
  };

  const imageUrl = getImageUrl();

  const getStockBadge = () => {
    switch (product.stock_status) {
      case 'in_stock':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> In stock
          </span>
        );
      case 'low_stock':
        return (
          <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3" /> Low stock
          </span>
        );
      case 'out_of_stock':
        return <span className="bg-rose-500/20 text-rose-300 text-xs px-2 py-1 rounded-full">Out of stock</span>;
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div
      className={`relative h-full rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:-translate-y-2 hover:border-indigo-400/40 group ${
        featured ? 'shadow-[0_30px_80px_rgba(9,11,26,0.4)]' : 'shadow-[0_20px_60px_rgba(9,11,26,0.25)]'
      }`}
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050815]/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 border border-white/20 text-white">
                <Sparkles className="w-3 h-3 text-indigo-200" />
                Featured
              </div>
            )}
            {product.on_sale && product.sale_discount && product.sale_discount > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-100">
                <Percent className="w-3 h-3" />
                {product.sale_discount}% Off
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4">{getStockBadge()}</div>
        </div>
      </Link>

      <div className="p-6 space-y-5">
        <Link to={`/products/${product.id}`} className="space-y-3 block">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white line-clamp-1">{product.name}</h3>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 line-clamp-1">{product.category}</p>
              {product.average_rating && product.average_rating > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.average_rating!)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400">({product.review_count || 0})</span>
                </div>
              )}
            </div>
            <div className="text-right whitespace-nowrap">
              {product.on_sale && product.original_price ? (
                <>
                  <span className="text-xs text-slate-400 line-through block">${product.original_price.toFixed(2)}</span>
                  <span className="text-2xl font-semibold text-gradient">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-gradient">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            {product.features?.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-2 h-2 rounded-full bg-indigo-400/60" />
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={product.stock_status === 'out_of_stock' || isAdding}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            product.stock_status === 'out_of_stock'
              ? 'bg-white/5 text-slate-500 cursor-not-allowed'
              : isAdding
              ? 'bg-emerald-500 text-white'
              : 'btn-gradient'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {product.stock_status === 'out_of_stock' ? 'Out of stock' : 'Add to cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
