import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Sparkles } from 'lucide-react';
import { dataService, ProductWithSale } from '../services/dataService';
import { addToCart } from '../utils/cart';

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<ProductWithSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wishlist' || e.key === 'alxne_products' || e.key === 'sales_campaigns' || e.key === null) {
        fetchWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchWishlist = () => {
    try {
      const wishlistData = localStorage.getItem('wishlist');
      const wishlistIds: string[] = wishlistData ? JSON.parse(wishlistData) : [];

      const allProducts = dataService.getProductsWithSales();
      const products = allProducts.filter(p => wishlistIds.includes(p.id));

      setWishlistProducts(products);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setRemovingId(productId);

    setTimeout(() => {
      try {
        const wishlistData = localStorage.getItem('wishlist');
        let wishlist: string[] = wishlistData ? JSON.parse(wishlistData) : [];
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        setWishlistProducts(prev => prev.filter(p => p.id !== productId));

        window.dispatchEvent(new StorageEvent('storage', {
          key: 'wishlist',
          newValue: JSON.stringify(wishlist),
          storageArea: localStorage
        }));
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      } finally {
        setRemovingId(null);
      }
    }, 300);
  };

  const handleAddToCart = (product: ProductWithSale) => {
    setAddingToCartId(product.id);
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url
    });
    setTimeout(() => setAddingToCartId(null), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-gray-500 rounded-full animate-spin"></div>
          <Heart className="w-6 h-6 text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Heart className="w-12 h-12 text-red-500 fill-red-500/20" />
              <Sparkles className="w-4 h-4 text-red-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="text-gray-400 mt-2 text-lg">Your curated collection of favorites</p>
            </div>
          </div>
          {wishlistProducts.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <span className="text-sm text-gray-400">{wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved</span>
            </div>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-900/80 border border-gray-800 rounded-2xl backdrop-blur-sm animate-fade-in">
            <div className="relative inline-block mb-6">
              <Heart className="w-24 h-24 text-gray-700 mx-auto animate-float" />
              <div className="absolute inset-0 bg-gray-500/20 blur-3xl rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Discover amazing products and save your favorites for later
            </p>
            <button
              onClick={() => navigate('/products')}
              className="group relative bg-gradient-to-r from-gray-600 to-gray-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-400 transition-all shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Explore Products
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/10 animate-fade-in ${
                  removingId === product.id ? 'animate-scale-out' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {product.on_sale && product.sale_discount && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1 animate-slide-in-left shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      {product.sale_discount}% OFF
                    </div>
                  )}

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg backdrop-blur-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 right-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
                      product.stock_status === 'in_stock'
                        ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                        : product.stock_status === 'low_stock'
                        ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                        : 'bg-red-500/30 text-red-300 border border-red-500/50'
                    }`}>
                      {product.stock_status === 'in_stock' ? 'In Stock' :
                       product.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between mb-4">
                    {product.on_sale && product.original_price ? (
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-through">
                          ${product.original_price.toFixed(2)}
                        </span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_status === 'out_of_stock' || addingToCartId === product.id}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      product.stock_status === 'out_of_stock'
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : addingToCartId === product.id
                        ? 'bg-green-500 text-white scale-95'
                        : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-500 hover:to-gray-400 shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 hover:scale-105'
                    }`}
                  >
                    {addingToCartId === product.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
