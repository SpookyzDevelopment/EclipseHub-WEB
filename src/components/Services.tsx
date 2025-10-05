import { Lock, Users, Headphones, ArrowRight, Sparkles } from 'lucide-react';

const services = [
  {
    icon: Sparkles,
    title: 'Service Launch Architecture',
    description: 'Blueprint, package, and launch your offers with our battle-tested frameworks, from onboarding to fulfillment.',
    color: 'from-fuchsia-500/20 to-purple-500/20'
  },
  {
    icon: Lock,
    title: 'Secure Delivery Infrastructure',
    description: 'Enterprise-grade protection, access controls, and observability keep every client touchpoint safeguarded.',
    color: 'from-purple-500/20 to-sky-500/20'
  },
  {
    icon: Users,
    title: 'Customer Success Pods',
    description: 'Dedicated pods embedded with your team to manage escalations, retention campaigns, and loyalty programs.',
    color: 'from-sky-500/20 to-fuchsia-500/20'
  },
  {
    icon: Headphones,
    title: '24/7 Neon Support Desk',
    description: 'Always-on support with live response SLAs, multilingual coverage, and proactive service checks.',
    color: 'from-purple-500/20 to-emerald-500/20'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0b0121] to-[#050013]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Eclipse Hub <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">Delivers</span>
          </h2>
          <p className="text-violet-100/80 text-lg max-w-2xl mx-auto">
            Modular service layers tuned for scale, security, and unforgettable client experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-8 rounded-2xl hover:border-fuchsia-400/40 transition-all group relative overflow-hidden shadow-[0_25px_45px_rgba(79,70,229,0.2)]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`}
                />

                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 bg-gradient-to-br from-fuchsia-500/40 via-purple-500/40 to-sky-400/40 rounded-xl group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-violet-100/80 leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center text-sky-200 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Dive into the workflow</span>
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
