import { CreditCard, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const paymentCategories = [
  {
    title: 'Cards',
    description: 'All major credit and debit cards accepted with instant processing and intelligent fraud protection.',
    methods: [
      { name: 'Visa', color: 'from-indigo-500 to-indigo-400' },
      { name: 'Mastercard', color: 'from-orange-500 to-rose-500' },
      { name: 'American Express', color: 'from-blue-500 to-sky-400' },
      { name: 'Discover', color: 'from-amber-500 to-orange-400' },
      { name: 'JCB', color: 'from-violet-500 to-sky-400' },
      { name: 'Apple Pay', color: 'from-slate-900 to-slate-800' },
      { name: 'Google Pay', color: 'from-green-500 to-teal-400' }
    ],
    stats: [
      { label: 'Processing time', value: 'Instant' },
      { label: 'Security', value: '3D Secure' },
      { label: 'Coverage', value: 'Global' }
    ]
  },
  {
    title: 'Cryptocurrencies',
    description: 'Fast and secure crypto payments with realtime price locking, low fees and treasury reconciliation.',
    methods: [
      { name: 'Bitcoin', color: 'from-amber-500 to-orange-400' },
      { name: 'Ethereum', color: 'from-purple-500 to-indigo-400' },
      { name: 'USDC', color: 'from-sky-500 to-blue-400' }
    ],
    stats: [
      { label: 'Settlement', value: '10-30 min' },
      { label: 'Fees', value: 'Network only' },
      { label: 'Anonymity', value: 'Configurable' }
    ]
  },
  {
    title: 'Alternative',
    description: 'Popular alternative payment methods to meet your audience where they are.',
    methods: [
      { name: 'PayPal', color: 'from-indigo-500 to-blue-400' },
      { name: 'Cash App', color: 'from-emerald-500 to-emerald-400' },
      { name: 'Klarna', color: 'from-rose-400 to-pink-400' },
      { name: 'Amazon Pay', color: 'from-amber-500 to-yellow-400' }
    ],
    stats: [
      { label: 'Processing', value: 'Instant' },
      { label: 'Refund window', value: '24 hours' },
      { label: 'Support', value: '24/7' }
    ]
  }
];

export default function PaymentMethods() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % paymentCategories.length);
    }, 6000);

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
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-sky-500/15 via-indigo-500/15 to-transparent blur-[220px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        <div className="text-center mb-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] text-slate-300">
            <CreditCard className="w-4 h-4 text-indigo-200" /> PAYMENT NETWORK
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Seamless payments, tailored for every audience.
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Eclipse Hub connects to trusted payment providers around the globe, giving your customers their preferred way to pay without friction.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-white/5 border border-white/10 p-3 rounded-full hover:border-indigo-300/40 hover:bg-indigo-500/20 transition-all backdrop-blur"
            aria-label="Previous payment category"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-white/5 border border-white/10 p-3 rounded-full hover:border-indigo-300/40 hover:bg-indigo-500/20 transition-all backdrop-blur"
            aria-label="Next payment category"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="relative overflow-hidden rounded-[32px] min-h-[540px]">
            {paymentCategories.map((category, index) => (
              <div
                key={category.title}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === activeIndex
                    ? 'opacity-100 translate-x-0'
                    : index < activeIndex
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="relative h-full rounded-[32px] border border-white/10 bg-[#060b19]/70 backdrop-blur-xl p-10 overflow-hidden shadow-[0_30px_80px_rgba(9,11,26,0.45)]">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-700" />
                  </div>

                  <div className="relative z-10 flex flex-col gap-10 h-full">
                    <div className="text-center space-y-4">
                      <h3 className="text-3xl font-semibold text-white">{category.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                      {category.methods.map((method, methodIndex) => (
                        <div
                          key={method.name}
                          className="relative px-5 py-3 rounded-2xl bg-white text-slate-900 text-sm font-semibold shadow-[0_15px_35px_rgba(9,11,26,0.18)]"
                          style={{
                            animation: 'slideUp 0.6s ease-out forwards',
                            animationDelay: `${methodIndex * 60 + 100}ms`,
                            opacity: 0
                          }}
                        >
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${method.color} opacity-0 hover:opacity-10 transition-opacity`} />
                          <span className="relative">{method.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mt-auto">
                      {category.stats.map((stat, statIndex) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center"
                          style={{
                            animation: 'slideUp 0.6s ease-out forwards',
                            animationDelay: `${statIndex * 120 + 300}ms`,
                            opacity: 0
                          }}
                        >
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {paymentCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? 'w-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500'
                  : 'w-4 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`View payment category ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm text-slate-200">
            <Shield className="w-4 h-4 text-indigo-200" />
            All transactions are secured with industry-grade encryption and compliance monitoring.
          </div>
        </div>
      </div>
    </section>
  );
}
