import { Check, Zap } from 'lucide-react';

const features = [
  'Reactive lighting responds to your music in milliseconds',
  'Instant download vault with lifetime access to digital assets',
  'Secure checkout with multi-currency support and tokenized wallets',
  'Live drop tracker with status notifications on every milestone',
  'Creator care team on standby for tuning and personalization',
  'Sustainably sourced components with cosmic-grade durability',
  'Custom engraving and holographic finishes on select hardware',
  'One-tap setup guides with immersive AR walkthroughs'
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0a0127] to-[#050013] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[160px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur animate-fade-glow">
              <Zap className="w-4 h-4 text-sky-300" />
              <span className="text-sm text-violet-100/90 font-medium">Powered by the Eclipse Hub fabrication studio</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built to Thrill,
              <br />
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
                Finished to Glow
              </span>
            </h2>
            <p className="text-violet-100/80 text-lg mb-8 leading-relaxed">
              Each product is tuned inside our neon lab and backed by live performance analytics. From creator desks to
              XR arenas, Eclipse Hub gear adapts to every imagination you bring to life.
            </p>
            <button className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-8 py-3 rounded-xl font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.35)]">
              Explore the Experience Guide
            </button>
          </div>

          <div className="bg-white/10 border border-white/15 p-8 rounded-2xl backdrop-blur-lg shadow-[0_25px_60px_rgba(56,189,248,0.25)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="bg-gradient-to-br from-fuchsia-400 via-purple-400 to-sky-400 rounded-full p-1.5 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="w-3 h-3 text-[#050013]" strokeWidth={3} />
                  </div>
                  <span className="text-violet-100/80 group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
