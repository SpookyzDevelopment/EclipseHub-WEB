import { Check, Zap } from 'lucide-react';

const features = [
  'White-label portals and branded touchpoints',
  'Automated fulfillment workflows',
  'Secure payment orchestration',
  'Client journey analytics in real time',
  'Hybrid human + AI support coverage',
  'Global compliance alignment',
  'Dedicated success strategist',
  'Neon-fast incident response'
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0a0127] to-[#050013] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[160px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur">
              <Zap className="w-4 h-4 text-sky-300" />
              <span className="text-sm text-violet-100/90 font-medium">Built for luminous performance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need,
              <br />
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
                With None of the Friction
              </span>
            </h2>
            <p className="text-violet-100/80 text-lg mb-8 leading-relaxed">
              Eclipse Hub merges neon aesthetics with enterprise rigor. Our orchestrated delivery stack keeps your clients
              thrilled while your team scales effortlessly.
            </p>
            <button className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-8 py-3 rounded-xl font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.35)]">
              Discover the Eclipse Method
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
