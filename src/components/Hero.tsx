import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0020] via-[#1b0057] to-[#03000f]" />
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-fuchsia-500/30 rounded-full blur-[160px]" />
      <div className="absolute top-1/3 right-0 w-[36rem] h-[36rem] bg-sky-400/20 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] bg-purple-500/30 rounded-full blur-[160px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur animate-fade-glow">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span className="text-sm text-violet-100/90 font-medium">Eclipcestore.digital — limited drops from the Eclipse Hub atelier</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
            Neon Products,
            <br />
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-sky-300 bg-clip-text text-transparent">
              Crafted for Creative Worlds
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-violet-100/80 mb-10 leading-relaxed max-w-3xl mx-auto">
            Welcome to the Eclipse Hub marketplace. Shop luminous hardware, creator kits, and digital enchantments that
            elevate every project. Every item is tested in our lab, paired with live status tracking, and shipped with
            celestial-level care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-8 py-4 rounded-xl font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all flex items-center justify-center space-x-2 group shadow-[0_25px_80px_rgba(124,58,237,0.55)]"
            >
              <span>Shop New Drops</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#status"
              className="px-8 py-4 rounded-xl font-medium border border-white/20 text-white hover:bg-white/10 transition-all backdrop-blur flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Live Status
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-violet-100/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Now shipping: Eclipse Origin Boards</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
            <span>4,800+ custom builds delivered in 2024</span>
            <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
            <span>Tracked in real time with Aurora Status</span>
          </div>
        </div>
      </div>
    </section>
  );
}
