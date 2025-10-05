import { Check, Zap } from 'lucide-react';

const features = [
  'End-to-end encryption',
  'Automated backups',
  'Custom domain support',
  'API access',
  'Advanced analytics',
  'Team collaboration',
  'Priority support',
  'SLA guarantees'
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-gray-500/10 border border-gray-500/20 rounded-full">
              <Zap className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-gray-300 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need,
              <br />
              <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Out of the Box
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Built for professionals who demand excellence. Our platform combines
              cutting-edge technology with intuitive design, trusted by thousands of
              businesses worldwide.
            </p>
            <button className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all shadow-lg shadow-gray-500/25">
              Discover More
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-8 rounded-lg backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="bg-gradient-to-br from-gray-600 to-gray-500 rounded-full p-1 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
