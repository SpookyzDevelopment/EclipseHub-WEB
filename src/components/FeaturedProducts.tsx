import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { supabaseDataService, ProductWithSale } from '../services/supabaseDataService';

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const allProducts = await supabaseDataService.getProductsWithSales();
      const data = allProducts.filter((p) => p.is_featured).slice(0, 4);
      console.log(`🔄 Featured products refreshed - ${data.length} products loaded at ${new Date().toLocaleTimeString()}`);
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center text-slate-300">Loading feature drops...</div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-[260px]" />
      </div>

      <div className="max-w-7xl mx-auto relative space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-200" /> FEATURE DROPS
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Spotlight collections carefully curated for the Eclipse community.
            </h2>
            <p className="text-lg text-slate-300">
              Elevated bundles and flagship releases crafted for peak performance. Each drop is hand-picked by our commerce strategists.
            </p>
          </div>
          <Link
            to="/products"
            className="self-start lg:self-end inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white transition-colors"
          >
            View the full catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="h-full"
              style={{ animation: 'fade-up 0.6s ease-out forwards', animationDelay: `${index * 80}ms`, opacity: 0 }}
            >
              <ProductCard product={product} featured />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
