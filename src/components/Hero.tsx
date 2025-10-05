import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-gray-600/5 pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gray-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-full">
            <Sparkles className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300 font-medium">Welcome to the Future of Account Management</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
            Your Digital Life,
            <br />
            <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Experience seamless account management with enterprise-grade security.
            Join thousands of satisfied users who trust ALXNE for their digital needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-8 py-4 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-gray-500/25"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#services"
              className="border border-gray-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 hover:border-gray-600 transition-all"
            >
              Learn More
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full" />
            <span>Trusted by 50,000+ users</span>
            <div className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full" />
            <span>99.9% uptime guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
