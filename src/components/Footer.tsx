import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#040012] border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-fuchsia-400" strokeWidth={1.5} />
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
                Eclipse Hub
              </span>
            </div>
            <p className="text-violet-100/80 text-sm">
              Eclipse Hub curates luminous gear, digital skins, and creative technology that fuels the eclipcestore.digital marketplace.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-violet-100/70">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Limited Drops</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Shipping & FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Support Studio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-violet-100/70">
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Glow Club</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors text-violet-100/60">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-violet-100/70">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@eclipcestore.digital</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (415) 555-2040</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Global · Remote-first</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-violet-100/60">
          <p>&copy; 2024 Eclipse Hub · eclipcestore.digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
