import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-2xl p-12 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Join thousands of satisfied customers and experience the difference.
              Start your journey with ALXNE today and unlock premium features instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-8 py-4 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-gray-500/25"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border border-gray-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 hover:border-gray-600 transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Contact Sales</span>
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
