import { useState, useEffect } from 'react';
import PaymentMethods from '../components/PaymentMethods';
import { Filter, Search, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductFeaturesCarousel from '../components/ProductFeaturesCarousel';
import { supabaseDataService, ProductWithSale } from '../services/supabaseDataService';

export default function Products() {
  const [products, setProducts] = useState<ProductWithSale[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Accounts', 'Security', 'Developer Tools', 'Team Tools', 'Analytics'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setError(null);
      const data = await supabaseDataService.getProductsWithSales();
      console.log(`🔄 Products page refreshed - ${data.length} products loaded at ${new Date().toLocaleTimeString()}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-xl text-gray-400">
            Explore our complete catalog of premium digital products and services
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 p-4 rounded-lg">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg shadow-gray-500/25'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <PaymentMethods />
    </section>
  );
}
