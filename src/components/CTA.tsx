import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0b0121] to-[#050013]">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/15 rounded-3xl p-12 md:p-16 overflow-hidden shadow-[0_40px_90px_rgba(124,58,237,0.35)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400/30 rounded-full blur-[160px]" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Your Neon Setup?</h2>
            <p className="text-xl text-violet-100/80 mb-10 leading-relaxed">
              Join the eclipcestore.digital community for exclusive drops, creative labs, and concierge styling that brings your
              ideas to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-8 py-4 rounded-xl font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all flex items-center justify-center space-x-2 group shadow-[0_25px_65px_rgba(56,189,248,0.35)]"
              >
                <span>Explore the Catalog</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border border-white/20 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 backdrop-blur">
                <MessageCircle className="w-5 h-5" />
                <span>Talk to a Stylist</span>
              </button>
            </div>

            <p className="text-sm text-violet-100/70 mt-6">
              Limited drops weekly • Custom mod sessions • Global express shipping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
