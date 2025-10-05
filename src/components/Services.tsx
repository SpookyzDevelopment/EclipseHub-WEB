import { Lock, Sparkles, Layers, Rocket, ArrowRight } from 'lucide-react';

const collections = [
  {
    icon: Sparkles,
    title: 'Luminous Creator Kits',
    description:
      'Modular synth boards, reactive lighting, and holo-audio tools engineered for studio-grade storytelling.',
    color: 'from-fuchsia-500/20 via-purple-500/20 to-sky-500/20'
  },
  {
    icon: Layers,
    title: 'Digital Wear & Skins',
    description: 'Avatar wraps, XR-ready outfits, and shader presets that keep every universe you enter on-brand.',
    color: 'from-purple-500/20 via-violet-500/20 to-amber-500/20'
  },
  {
    icon: Lock,
    title: 'Secure Core Hardware',
    description: 'Quantum-stable drives, signal-scrambling routers, and privacy-first hubs built for limitless exploration.',
    color: 'from-sky-500/20 via-cyan-500/20 to-fuchsia-500/20'
  },
  {
    icon: Rocket,
    title: 'Limited Astral Drops',
    description: 'Weekly collaborations with cosmic artists. Each item is serialized, time-gated, and instantly collectible.',
    color: 'from-emerald-500/20 via-teal-500/20 to-purple-500/20'
  }
];

export default function Services() {
  return (
    <section id="collections" className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0b0121] to-[#050013]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Signature <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">Collections</span>
          </h2>
          <p className="text-violet-100/80 text-lg max-w-2xl mx-auto">
            Curated by Eclipse Hub designers for creators who crave vibrant tools, tangible art, and neon-future aesthetics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => {
            const Icon = collection.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-8 rounded-2xl hover:border-fuchsia-400/40 transition-all group relative overflow-hidden shadow-[0_35px_65px_rgba(79,70,229,0.25)] hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`}
                />

                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 bg-gradient-to-br from-fuchsia-500/40 via-purple-500/40 to-sky-400/40 rounded-xl group-hover:scale-110 transition-transform animate-glow-pulse">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{collection.title}</h3>
                  <p className="text-violet-100/80 leading-relaxed mb-4">{collection.description}</p>
                  <div className="flex items-center text-sky-200 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Shop the story</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
