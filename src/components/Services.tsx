import { Shield, Lock, Users, Headphones, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Shield,
    title: 'Account Management',
    description: 'Comprehensive account lifecycle management with advanced security protocols and automated workflows.',
    color: 'from-gray-500/20 to-gray-600/20'
  },
  {
    icon: Lock,
    title: 'Security Solutions',
    description: 'Enterprise-grade encryption, two-factor authentication, and continuous monitoring for maximum protection.',
    color: 'from-gray-600/20 to-gray-500/20'
  },
  {
    icon: Users,
    title: 'Multi-User Support',
    description: 'Scalable solutions for teams and organizations with role-based access control and permissions.',
    color: 'from-gray-500/20 to-gray-700/20'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and dedicated account managers for enterprise clients.',
    color: 'from-gray-700/20 to-gray-500/20'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What We <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Offer</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional solutions designed to elevate your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 p-8 rounded-lg hover:border-gray-700 transition-all group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center text-gray-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
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
