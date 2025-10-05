import { Shield, Zap, CreditCard, Settings, Download, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Download,
    title: 'Instant Delivery',
    description: 'All products are immediately available for download after purchase.',
    stats: [
      { label: 'Delivery Speed', value: '< 1 second' },
      { label: 'Success Rate', value: '99.9%' },
      { label: 'Downloads/Day', value: '1,000+' }
    ]
  },
  {
    icon: Shield,
    title: 'Safe & Undetected',
    description: 'We provide the most secure and undetected products on the market.',
    stats: [
      { label: 'Detection Rate', value: '0.0%' },
      { label: 'Last Update', value: '2 hours ago' },
      { label: 'Active Users', value: '50,000+' }
    ]
  },
  {
    icon: Settings,
    title: 'Save & Share Configs',
    description: 'Easily save your configs and share them, or use community setups.',
    stats: [
      { label: 'Config Storage', value: 'Unlimited' },
      { label: 'Community Configs', value: '10,000+' },
      { label: 'Auto-Sync', value: 'Enabled' }
    ]
  },
  {
    icon: CreditCard,
    title: 'Secure Payment Methods',
    description: 'All transactions are processed through trusted payment gateways to ensure maximum safety and reliability.',
    stats: [
      { label: 'Payment Options', value: '10+' },
      { label: 'Encryption', value: 'AES-256' },
      { label: 'Transactions', value: '100K+' }
    ]
  },
  {
    icon: Eye,
    title: 'Easy Setup',
    description: 'Our products are built for a smooth, user-friendly experience, any user can set up and use our cheats with ease.',
    stats: [
      { label: 'Setup Time', value: '< 2 minutes' },
      { label: 'User Rating', value: '4.9/5.0' },
      { label: 'Support Available', value: '24/7' }
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
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Why Choose <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">Us?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Experience unmatched service quality. Our dedicated team is here around the clock to support you and simplify every step of the process.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 bg-gray-900/80 border border-gray-700 p-3 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6 text-gray-300" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 bg-gray-900/80 border border-gray-700 p-3 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6 text-gray-300" />
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
                <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-900/50 to-gray-900/90 border border-gray-700 p-12 rounded-2xl overflow-hidden shadow-2xl shadow-gray-500/20 h-full">
                  {/* Animated border shimmer */}
                  <div className="absolute inset-0 opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent translate-x-[-200%] animate-shimmer" />
                  </div>

                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-gray-500/5 opacity-50" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="mb-8 relative">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-500 opacity-10 absolute inset-0 blur-2xl animate-pulse" />
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-500 p-6 relative flex items-center justify-center">
                        <feature.icon className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
                      {feature.description}
                    </p>

                    {/* Animated stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                      {feature.stats.map((stat, statIndex) => (
                        <div
                          key={statIndex}
                          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 transition-all duration-500 hover:border-gray-600 hover:bg-gray-800/70"
                          style={{
                            animation: 'slideUp 0.6s ease-out forwards',
                            animationDelay: `${statIndex * 100 + 200}ms`,
                            opacity: 0
                          }}
                        >
                          <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
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
                  ? 'w-12 bg-gradient-to-r from-gray-600 to-gray-500'
                  : 'w-3 bg-gray-800 hover:bg-gray-700'
              }`}
              aria-label={`View feature ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-full backdrop-blur-sm group hover:border-gray-600 transition-all cursor-pointer">
            <Zap className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">All features included in every product</span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
