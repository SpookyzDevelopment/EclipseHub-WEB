import { CreditCard, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const paymentCategories = [
  {
    title: 'Cards',
    description: 'All major credit and debit cards accepted with instant processing',
    methods: [
      { name: 'Visa', color: 'from-blue-600 to-blue-500' },
      { name: 'Mastercard', color: 'from-red-600 to-orange-500' },
      { name: 'Maestro', color: 'from-blue-600 to-red-500' },
      { name: 'American Express', color: 'from-blue-500 to-blue-400' },
      { name: 'Discover', color: 'from-orange-500 to-orange-400' },
      { name: 'Diners Club', color: 'from-blue-600 to-blue-500' },
      { name: 'JCB', color: 'from-green-600 to-blue-500' },
      { name: 'UnionPay', color: 'from-red-600 to-blue-600' },
      { name: 'Apple Pay', color: 'from-gray-900 to-gray-800' },
      { name: 'Google Pay', color: 'from-blue-600 to-green-500' }
    ],
    stats: [
      { label: 'Processing Time', value: 'Instant' },
      { label: 'Security', value: '3D Secure' },
      { label: 'Acceptance', value: 'Worldwide' }
    ]
  },
  {
    title: 'Cryptocurrencies',
    description: 'Fast and secure crypto payments with low fees and complete anonymity',
    methods: [
      { name: 'Bitcoin', color: 'from-orange-500 to-orange-400' },
      { name: 'Litecoin', color: 'from-blue-400 to-gray-400' }
    ],
    stats: [
      { label: 'Transaction Speed', value: '10-30 min' },
      { label: 'Fees', value: 'Network only' },
      { label: 'Anonymity', value: 'Full' }
    ]
  },
  {
    title: 'Alternative',
    description: 'Popular alternative payment methods for your convenience',
    methods: [
      { name: 'PayPal', color: 'from-blue-600 to-blue-400' },
      { name: 'Paysafecard', color: 'from-blue-500 to-blue-600' },
      { name: 'Cash App', color: 'from-green-500 to-green-400' },
      { name: 'Amazon Pay', color: 'from-orange-400 to-yellow-600' }
    ],
    stats: [
      { label: 'Processing', value: 'Instant' },
      { label: 'Refund Policy', value: '24 hours' },
      { label: 'Support', value: '24/7' }
    ]
  }
];

export default function PaymentMethods() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % paymentCategories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + paymentCategories.length) % paymentCategories.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % paymentCategories.length);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">PAYMENTS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Payment <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">Methods</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Pay your way with fast and secure options tailored to your needs.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 bg-gray-900/80 border border-gray-700 p-3 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Previous payment category"
          >
            <ChevronLeft className="w-6 h-6 text-gray-300" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 bg-gray-900/80 border border-gray-700 p-3 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Next payment category"
          >
            <ChevronRight className="w-6 h-6 text-gray-300" />
          </button>

          {/* Carousel Content */}
          <div className="relative overflow-hidden rounded-2xl min-h-[600px]">
            {paymentCategories.map((category, index) => (
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

                  <div className="relative z-10">
                    {/* Title Section */}
                    <div className="text-center mb-12">
                      <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {category.title}
                      </h3>
                      <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        {category.description}
                      </p>
                    </div>

                    {/* Payment Methods Grid */}
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                      {category.methods.map((method, methodIndex) => (
                        <div
                          key={methodIndex}
                          className="group relative bg-white rounded-xl p-4 min-w-[100px] transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-gray-500/20"
                          style={{
                            animation: 'slideUp 0.6s ease-out forwards',
                            animationDelay: `${methodIndex * 50 + 100}ms`,
                            opacity: 0
                          }}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                          <div className="relative flex items-center justify-center h-12">
                            <span className="font-bold text-gray-900 text-sm text-center">
                              {method.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                      {category.stats.map((stat, statIndex) => (
                        <div
                          key={statIndex}
                          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 transition-all duration-500 hover:border-gray-600 hover:bg-gray-800/70"
                          style={{
                            animation: 'slideUp 0.6s ease-out forwards',
                            animationDelay: `${statIndex * 100 + 400}ms`,
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
          {paymentCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-500 ${
                activeIndex === index
                  ? 'w-12 bg-gradient-to-r from-gray-600 to-gray-500'
                  : 'w-3 bg-gray-800 hover:bg-gray-700'
              }`}
              aria-label={`View payment category ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-full backdrop-blur-sm group hover:border-gray-600 transition-all">
            <Shield className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">All transactions are secured with industry-standard encryption</span>
          </div>
        </div>
      </div>
    </section>
  );
}
