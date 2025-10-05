import { useState, useEffect } from 'react';
import PaymentMethods from '../components/PaymentMethods';
import { Filter, Search, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { supabaseDataService, ProductWithSale } from '../services/supabaseDataService';

const categories = ['all', 'Accounts', 'Security', 'Developer Tools', 'Team Tools', 'Analytics'];

export default function Products() {
  const [products, setProducts] = useState<ProductWithSale[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
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
          <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-slate-300 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-14 h-14 text-indigo-300 mx-auto" />
          <p className="text-rose-300 text-lg">{error}</p>
          <button
            onClick={fetchProducts}
            className="btn-gradient px-6 py-3 rounded-lg text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[38rem] h-[38rem] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent blur-[240px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-200" /> CATALOGUE
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Explore Eclipse Hub’s curated library of premium products.
            </h1>
            <p className="text-lg text-slate-300">
              Each solution is configured and tested by our commerce strategists to deliver exceptional customer journeys.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 w-full lg:max-w-md">
            {[{ label: 'Launch velocity', value: '5 days' }, { label: 'Automation coverage', value: '92%' }, { label: 'Client retention', value: '98%' }].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-5 text-center">
                <p className="text-xl font-semibold text-gradient">{item.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search the collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-[0_15px_40px_rgba(79,70,229,0.25)]'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:border-indigo-400/40'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                style={{ animation: 'fade-up 0.6s ease-out forwards', animationDelay: `${index * 60}ms`, opacity: 0 }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <Sparkles className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
            <p className="text-slate-300 text-lg mb-2">No products found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters to discover more.</p>
          </div>
        )}
      </div>

      <PaymentMethods />
    </section>
  );
}
