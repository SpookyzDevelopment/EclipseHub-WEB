import { Shield, Zap, CreditCard, Settings, Download, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Download,
    title: 'Drop Radar Prime',
    description: 'Reserve limited releases before they go public and track heat levels across the entire marketplace.',
    stats: [
      { label: 'Early access window', value: '48 hrs' },
      { label: 'Live drop alerts', value: 'Instant' },
      { label: 'Exclusive drops', value: '70+/yr' }
    ]
  },
  {
    icon: Zap,
    title: 'Hyper Shipping Network',
    description: 'Holographic packaging, carbon-neutral couriers, and GPS pings at every milestone from lab to doorstep.',
    stats: [
      { label: 'Avg. delivery', value: '2 days' },
      { label: 'Coverage zones', value: '45' },
      { label: 'Live scans', value: '6+' }
    ]
  },
  {
    icon: Shield,
    title: 'Authenticity Shield',
    description: 'Every product includes NFC verification, tamper-proof seals, and blockchain-backed provenance logs.',
    stats: [
      { label: 'Counterfeits blocked', value: '100%' },
      { label: 'Verification taps', value: '3M' },
      { label: 'Warranty window', value: '24 mo' }
    ]
  },
  {
    icon: Settings,
    title: 'Mod Lab Personalization',
    description: 'Tune firmware, color palettes, and audio profiles with a drag-and-drop canvas before items even ship.',
    stats: [
      { label: 'Preset library', value: '400+' },
      { label: 'Real-time previews', value: 'Yes' },
      { label: 'Collab slots', value: 'Unlimited' }
    ]
  },
  {
    icon: CreditCard,
    title: 'Fluid Payments',
    description: 'Split payments, creator credits, and vault-ready tokens designed for global collaborators.',
    stats: [
      { label: 'Payment methods', value: '24' },
      { label: 'Auto rewards', value: '5%' },
      { label: 'Currencies', value: '18' }
    ]
  },
  {
    icon: Eye,
    title: 'Aurora Status Vision',
    description: 'A cinematic dashboard that visualizes your order journey with particle trails and milestone calls.',
    stats: [
      { label: 'Refresh rate', value: '15s' },
      { label: 'Status themes', value: '12' },
      { label: 'Shared views', value: 'Teamwide' }
    ]
  }
];

export default function Pricing() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right');
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const activeFeature = features[activeIndex];

  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0e012f] to-[#050013] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-sky-400/20 rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Why Creators Choose <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">Eclipcestore.digital</span>
          </h2>
          <p className="text-violet-100/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Experience a retail playground built for experimentation. We merge tactile craftsmanship, instant digital rewards,
            and live status art so every purchase feels like a show.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 bg-white/10 border border-white/20 p-3 rounded-full hover:bg-fuchsia-500/20 hover:border-fuchsia-400/40 transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 bg-white/10 border border-white/20 p-3 rounded-full hover:bg-fuchsia-500/20 hover:border-fuchsia-400/40 transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Carousel Content */}
          <div className="relative overflow-hidden rounded-2xl min-h-[500px]">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === activeIndex
                    ? 'opacity-100 translate-x-0'
                    : index < activeIndex
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/15 p-12 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(124,58,237,0.35)] h-full">
                  {/* Animated border shimmer */}
                  <div className="absolute inset-0 opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent translate-x-[-200%] animate-shimmer" />
                  </div>

                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-sky-400/10 opacity-60" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="mb-8 relative">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-sky-400 opacity-20 absolute inset-0 blur-2xl animate-pulse" />
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-400 p-6 relative flex items-center justify-center">
                        <feature.icon className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-sky-100 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-violet-100/80 text-lg leading-relaxed mb-10 max-w-2xl">
                      {feature.description}
                    </p>

                    {/* Animated stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                      {feature.stats.map((stat, statIndex) => (
                        <div
                          key={statIndex}
                          className="bg-white/10 rounded-xl border border-white/15 p-6 transition-all duration-500 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10"
                          style={{
                            animation: 'slideUp 0.6s ease-out forwards',
                            animationDelay: `${statIndex * 100 + 200}ms`,
                            opacity: 0
                          }}
                        >
                          <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-fuchsia-200 via-purple-100 to-sky-200 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <div className="text-sm text-violet-100/70 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-500 ${
                activeIndex === index
                  ? 'w-12 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400'
                  : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`View feature ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-xl group hover:border-fuchsia-400/40 transition-all cursor-pointer">
            <Zap className="w-5 h-5 text-sky-300 group-hover:text-white transition-colors" />
            <span className="text-violet-100/80 font-medium group-hover:text-white transition-colors">Glow Club members unlock early drops, bonus mods, and concierge support</span>
            <ChevronRight className="w-4 h-4 text-violet-100/60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
