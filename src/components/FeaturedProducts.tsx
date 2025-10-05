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
      const data = allProducts.filter(p => p.is_featured).slice(0, 4);
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
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center text-gray-400">Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-4xl md:text-5xl font-bold">Featured Products</h2>
            </div>
            <p className="text-xl text-gray-400">
              Premium selections handpicked for maximum value
            </p>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} featured />
            </div>
          ))}
        </div>

        <Link
          to="/products"
          className="md:hidden flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <span>View All Products</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
