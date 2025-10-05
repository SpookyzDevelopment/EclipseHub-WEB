import { Check, ArrowRight, Star, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Launch Studio',
    price: '1,290',
    cadence: 'per month',
    description: 'Everything you need to open your Eclipse storefront with curated drops and foundational support.',
    features: [
      'Dedicated launch strategist',
      'Product catalogue configuration',
      'Secure checkout & fulfilment automations',
      'Monthly performance reporting'
    ],
    badge: 'Most popular',
    accent: 'from-indigo-500 via-purple-500 to-sky-500'
  },
  {
    name: 'Signature Collective',
    price: 'Custom',
    cadence: 'annual partnership',
    description: 'For established brands seeking global coverage, concierge service and co-created campaigns.',
    features: [
      '24/7 concierge success pod',
      'Global payment orchestration & compliance',
      'VIP community programs and loyalty mechanics',
      'Executive insights, forecasting & dedicated squad'
    ],
    badge: 'Enterprise',
    accent: 'from-amber-400 via-purple-500 to-indigo-500'
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent blur-[240px]" />
      </div>

      <div className="max-w-7xl mx-auto relative space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] text-slate-300">
            <Star className="w-4 h-4 text-indigo-200" /> PARTNERSHIP
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Choose a partnership model built around your stage of growth.
          </h2>
          <p className="text-lg text-slate-300">
            Every plan includes dedicated onboarding, premium support and access to Eclipse’s commerce playbooks. Upgrade or adapt as your product line evolves.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-8 xl:p-10 overflow-hidden transition-all hover:border-indigo-400/40"
            >
              <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${plan.accent}`} />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{plan.badge}</p>
                    <h3 className="text-3xl font-semibold text-white">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    <span className="text-sm text-slate-300">{plan.cadence}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{plan.description}</p>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                      <div className="rounded-full bg-white/10 border border-white/10 p-1">
                        <Check className="w-4 h-4 text-indigo-200" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:border-indigo-300/50 hover:bg-indigo-500/20 transition-colors">
                  {plan.name === 'Signature Collective' ? <Crown className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  Start a conversation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
