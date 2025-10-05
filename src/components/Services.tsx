import { Lock, Users, Headphones, Sparkles, Globe2, Workflow } from 'lucide-react';

const services = [
  {
    icon: Sparkles,
    title: 'Launch Strategy Pods',
    description:
      'Concept-to-market support with branded storefront design, asset preparation and ready-to-deploy copy kits.',
    badge: 'Concept',
    accent: 'from-indigo-400/20 via-purple-500/20 to-sky-400/20'
  },
  {
    icon: Workflow,
    title: 'Automated Fulfilment',
    description:
      'Workflow blueprints and automations keep product delivery, customer onboarding and loyalty programs synced.',
    badge: 'Operate',
    accent: 'from-purple-500/20 via-indigo-400/20 to-pink-400/20'
  },
  {
    icon: Lock,
    title: 'Secure Commerce Layer',
    description:
      'Enterprise-grade identity management, abuse prevention and multi-layered encryption by default.',
    badge: 'Protect',
    accent: 'from-sky-500/20 via-indigo-500/20 to-violet-500/20'
  },
  {
    icon: Users,
    title: 'Customer Success Pods',
    description:
      'Dedicated specialists monitoring feedback loops, orchestrating community drops and keeping retention above target.',
    badge: 'Delight',
    accent: 'from-fuchsia-500/20 via-purple-500/20 to-sky-500/20'
  },
  {
    icon: Headphones,
    title: '24/7 Concierge Support',
    description:
      'Human + AI coverage to triage escalations, manage VIP cases and nurture brand ambassadors across regions.',
    badge: 'Support',
    accent: 'from-emerald-500/20 via-sky-500/20 to-indigo-500/20'
  },
  {
    icon: Globe2,
    title: 'Global Logistics Mesh',
    description:
      'Localized payment orchestration and compliance-ready data routing spanning twelve regions and currencies.',
    badge: 'Scale',
    accent: 'from-amber-400/20 via-indigo-500/20 to-purple-500/20'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-200" /> SERVICES
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Everything you need to launch, scale and protect your Eclipse storefront.
          </h2>
          <p className="text-lg text-slate-300">
            Modular service layers designed to grow with your product line and deliver the boutique experience customers remember.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="relative group rounded-3xl border border-white/10 bg-white/5 p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/40"
                style={{ animation: 'fade-up 0.6s ease-out forwards', animationDelay: `${index * 80}ms`, opacity: 0 }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${service.accent}`} />

                <div className="relative z-10 flex flex-col gap-6 h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-100" />
                    </div>
                    <span className="text-xs tracking-[0.3em] text-slate-300 uppercase">{service.badge}</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-indigo-200 mt-auto">
                    Discover more
                    <span className="w-8 h-px bg-gradient-to-r from-indigo-200 to-transparent group-hover:w-12 transition-all" />
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
