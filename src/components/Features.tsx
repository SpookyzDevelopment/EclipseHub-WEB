import { Zap, Compass, ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';

const featureGroups = [
  {
    title: 'Precision onboarding',
    description: 'Bespoke flows greet every customer with your tone of voice, built on our data-backed templates.',
    icon: Compass,
    highlight: 'Launch'
  },
  {
    title: 'Operational clarity',
    description: 'Live dashboards capture fulfilment health, campaign performance and support velocity in one command centre.',
    icon: BarChart3,
    highlight: 'Monitor'
  },
  {
    title: 'Trust at scale',
    description: 'Zero trust infrastructure, multi-factor authentication and proactive incident response keeps customers confident.',
    icon: ShieldCheck,
    highlight: 'Secure'
  },
  {
    title: 'Revenue acceleration',
    description: 'Smart retries, localized payments and loyalty mechanics drive incremental sales and reduce churn.',
    icon: TrendingUp,
    highlight: 'Grow'
  }
];

export default function Features() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] text-slate-300">
              <Zap className="w-4 h-4 text-sky-200" /> PLATFORM
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              A commerce engine crafted for modern digital brands.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Eclipse Hub coordinates every touchpoint from the first pixel to ongoing loyalty. Our platform pairs human expertise with reliable automation so your products arrive with theatre and precision.
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <p className="text-sm text-slate-300">
                “Eclipse reimagined how we launch. What used to take a month now takes a week—and our customers love the polished journey.”
              </p>
              <div>
                <p className="text-sm font-semibold text-white">Monique Vega</p>
                <p className="text-xs tracking-[0.3em] text-slate-400 uppercase">Head of Digital, NovaSound</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {featureGroups.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="relative rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center transition-all hover:border-indigo-400/40 hover:-translate-y-1"
                  style={{ animation: 'fade-up 0.6s ease-out forwards', animationDelay: `${index * 90}ms`, opacity: 0 }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-100" />
                    </div>
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500/20 text-[11px] uppercase tracking-[0.3em] text-indigo-100">
                      {feature.highlight}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
