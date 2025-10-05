import { ProductWithSale } from '../services/dataService';
import { ShoppingCart, Check, Tag, Sparkles, Star, Percent } from 'lucide-react';
import { addToCart } from '../utils/cart';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const FALLBACK_IMAGE = "https://via.placeholder.com/400x300?text=No+Image+Available";

interface ProductCardProps {
  product: ProductWithSale;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Get the correct public URL for Supabase or external image
  const getImageUrl = () => {
    if (!product.image_url) return FALLBACK_IMAGE;

    if (product.image_url.startsWith("http")) {
      return product.image_url;
    } else {
      const { data } = supabase.storage
        .from("product-images") // bucket name
        .getPublicUrl(product.image_url);
      return data?.publicUrl || FALLBACK_IMAGE;
    }
  };

  const imageUrl = getImageUrl();

  const getStockBadge = () => {
    switch (product.stock_status) {
      case 'in_stock':
        return (
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
            <Check className="w-3 h-3" /> In Stock
          </span>
        );
      case 'low_stock':
        return (
          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
            <Tag className="w-3 h-3" /> Low Stock
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded backdrop-blur-sm">
            Out of Stock
          </span>
        );
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/10 ${featured ? 'lg:col-span-1' : ''}`}
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-800">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <div className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                FEATURED
              </div>
            )}
            {product.on_sale && product.sale_discount && product.sale_discount > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 animate-slide-in-left shadow-lg">
                <Percent className="w-3 h-3" />
                {product.sale_discount}% OFF
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3">{getStockBadge()}</div>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/products/${product.id}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              {product.average_rating && product.average_rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.average_rating!)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.review_count || 0})
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end ml-4">
              {product.on_sale && product.original_price ? (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                  <span className="text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-2 mb-4">
            {product.features?.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <div className="bg-gradient-to-br from-gray-600/20 to-gray-500/20 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-gray-300" strokeWidth={3} />
                </div>
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={product.stock_status === 'out_of_stock' || isAdding}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.stock_status === 'out_of_stock'
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : isAdding
              ? 'bg-green-500 text-white scale-95'
              : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-500 hover:to-gray-400 shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 hover:scale-105'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-5 h-5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {product.stock_status === 'out_of_stock'
                ? 'Out of Stock'
                : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
