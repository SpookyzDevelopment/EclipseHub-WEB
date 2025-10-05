import { Shield, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Navigate',
    links: [
      { label: 'Shop Products', href: '/products' },
      { label: 'How Eclipse Works', href: '/how-it-works' },
      { label: 'Frequently Asked Questions', href: '/faq' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Eclipse', href: '/how-it-works' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Admin Portal', href: '/admin/login' }
    ]
  }
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#040710]/80">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 right-[-10%] w-[30rem] h-[30rem] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent blur-[220px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="grid lg:grid-cols-[1.2fr_1fr_1fr] gap-12">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/10">
                <Shield className="w-5 h-5 text-indigo-200" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Eclipse</p>
                <p className="text-lg font-semibold text-white">Commerce Studio</p>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              We craft luminous storefronts and manage the entire lifecycle of your digital products—from drop strategy to global fulfilment and concierge support.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <Mail className="w-4 h-4" /> support@eclipcestore.digital
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <Phone className="w-4 h-4" /> +1 (415) 555-2040
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <MapPin className="w-4 h-4" /> Global · Remote-first
              </span>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm uppercase tracking-[0.3em] text-slate-400">{section.title}</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                {section.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="inline-flex items-center gap-2 hover:text-white transition-colors"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 text-slate-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs tracking-[0.25em] text-slate-500 uppercase">
          <p>&copy; {new Date().getFullYear()} Eclipse Hub · Commerce Studio. All rights reserved.</p>
          <p>Designed for premium digital experiences.</p>
        </div>
      </div>
    </footer>
  );
}
