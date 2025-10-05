import { ShoppingCart, Download, Key, Shield, CreditCard, Headphones } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function HowItWorks() {
  const steps = [
    {
      icon: ShoppingCart,
      title: 'Browse & Select',
      description: 'Browse our catalog of premium digital products, software licenses, and services. Use filters and search to find exactly what you need.',
    },
    {
      icon: CreditCard,
      title: 'Secure Checkout',
      description: 'Add items to your cart and proceed to checkout. We accept all major payment methods and ensure secure transactions.',
    },
    {
      icon: Key,
      title: 'Instant Delivery',
      description: 'Receive your license keys and download links immediately via email. Access everything from your dashboard anytime.',
    },
    {
      icon: Download,
      title: 'Download & Install',
      description: 'Download your digital products and use your license keys to activate. Detailed instructions included with every purchase.',
    },
    {
      icon: Shield,
      title: 'Lifetime Access',
      description: 'Your purchases are yours forever. Access your licenses, downloads, and order history anytime from your dashboard.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Need help? Our support team is available around the clock to assist with any questions or issues.',
    },
  ];

  const features = [
    {
      title: 'Instant Delivery',
      description: 'All digital products are delivered instantly after purchase completion.',
    },
    {
      title: 'Secure Transactions',
      description: 'Bank-level encryption protects your payment and personal information.',
    },
    {
      title: 'Lifetime Access',
      description: 'Keep your licenses and access downloads forever from your dashboard.',
    },
    {
      title: 'Money-Back Guarantee',
      description: '30-day refund policy on all purchases. No questions asked.',
    },
    {
      title: 'Multiple Devices',
      description: 'Most licenses work on multiple devices. Check product details for specifics.',
    },
    {
      title: 'Regular Updates',
      description: 'Get access to product updates and new versions as they become available.',
    },
  ];

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />

        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Works</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Getting your digital products is simple, fast, and secure. Here's how it works.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-gray-500/25">
                  {index + 1}
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-all"
              >
                <h3 className="font-bold mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Browse our catalog of premium digital products and start enjoying instant access to the tools you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all shadow-lg shadow-gray-500/25"
            >
              Browse Products
            </a>
            <a
              href="/contact"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium border border-gray-800 hover:border-gray-700 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
