import { ArrowRight, Sparkles, Check, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const highlightItems = [
  'Curated drops for creators and studios',
  'Global fulfilment with zero downtime',
  'Secure checkout, tailored launch plans'
];

const stats = [
  { label: 'Brands served', value: '480+' },
  { label: 'Successful launches', value: '2.3k' },
  { label: 'Satisfaction score', value: '98%' }
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent blur-[220px]" />
        <div className="absolute -bottom-24 -left-24 w-[32rem] h-[32rem] bg-gradient-to-br from-sky-400/20 via-indigo-500/15 to-transparent blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 xl:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur">
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span className="text-xs font-semibold tracking-[0.3em] text-slate-200">ECLIPSE COLLECTION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold leading-tight text-white">
              Elevate your digital catalogue with the
              <span className="block text-gradient">Eclipse commerce experience</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
              Eclipse Hub blends premium products, end-to-end delivery and concierge service into one luminous storefront.
              Launch faster, scale confidently and give your customers the finish they deserve.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/products"
                className="btn-gradient px-8 py-3 rounded-xl text-base font-semibold flex items-center gap-2"
              >
                Explore the catalogue
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#services"
                className="px-8 py-3 rounded-xl border border-white/15 text-slate-200 hover:border-indigo-400/40 hover:text-white transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                How Eclipse works
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 via-white/5 to-white/10 blur-xl" />
              <div className="relative rounded-[32px] border border-white/10 bg-[#070c1a]/60 backdrop-blur-xl p-10 space-y-10 shadow-[0_35px_80px_rgba(9,11,26,0.45)]">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Flagship release</p>
                  <h2 className="text-2xl font-semibold text-white">
                    Eclipse Studio Suite — complete launch infrastructure for modern creators.
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Modular automations, premium accounts, live onboarding and a dedicated support pod to keep your audience engaged.
                  </p>
                </div>

                <div className="grid gap-3">
                  {highlightItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="rounded-full bg-indigo-500/20 p-1.5">
                        <Check className="w-4 h-4 text-indigo-200" />
                      </div>
                      <span className="text-sm text-slate-200 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border border-dashed border-white/15 rounded-2xl px-6 py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Next Drop</p>
                    <p className="text-lg font-semibold text-white">Early access opens 12.01</p>
                  </div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors"
                  >
                    Join the waitlist
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="absolute -bottom-10 -left-10 hidden sm:block w-36 h-36 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-3xl opacity-20 blur-2xl animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
