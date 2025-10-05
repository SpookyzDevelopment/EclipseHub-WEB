import { Shield, Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartButton from './CartButton';
import AuthModal from './AuthModal';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.querySelector(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07001a]/95 border-b border-purple-500/30 shadow-[0_20px_50px_rgba(124,58,237,0.35)]'
          : 'bg-transparent'
      } backdrop-blur-xl`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-fuchsia-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-fuchsia-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
              Eclipse Hub
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') ? 'text-white font-semibold' : 'text-violet-200/70 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`flex items-center gap-1 transition-colors ${
                isActive('/products')
                  ? 'text-white font-semibold'
                  : 'text-violet-200/70 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Solutions
            </Link>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, '#pricing')}
              className="text-violet-200/70 hover:text-white transition-colors"
            >
              Why Eclipse Hub
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="text-violet-200/70 hover:text-white transition-colors"
            >
              Contact
            </a>
            <NotificationBell />
            <CartButton />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#120437]/80 border border-purple-500/40 rounded-lg hover:bg-[#1c0652]/80 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email?.split('@')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0b011f]/95 border border-purple-500/30 rounded-xl shadow-[0_20px_45px_rgba(124,58,237,0.35)] animate-in">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-violet-100/80 hover:bg-purple-600/20 transition-colors flex items-center gap-2"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-violet-100/80 hover:bg-purple-600/20 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-violet-100/80 hover:bg-purple-600/20 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-violet-100/80 hover:bg-purple-600/20 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-purple-600/20 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-6 py-2 rounded-lg font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all hover:scale-105 shadow-[0_15px_40px_rgba(56,189,248,0.35)]"
              >
                Partner with Us
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <CartButton />
            <button
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-in slide-in-from-top">
            <Link to="/" className="block text-violet-100/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/products" className="block text-violet-100/80 hover:text-white transition-colors flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Solutions
            </Link>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, '#pricing')}
              className="block text-violet-100/80 hover:text-white transition-colors"
            >
              Why Eclipse Hub
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="block text-violet-100/80 hover:text-white transition-colors"
            >
              Contact
            </a>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-violet-100/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/profile" className="block text-violet-100/80 hover:text-white transition-colors">
                  My Profile
                </Link>
                <Link to="/orders" className="block text-violet-100/80 hover:text-white transition-colors">
                  My Orders
                </Link>
                <Link to="/wishlist" className="block text-violet-100/80 hover:text-white transition-colors">
                  Wishlist
                </Link>
                <button
                  onClick={signOut}
                  className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white px-6 py-2 rounded-lg font-medium hover:from-rose-400 hover:to-fuchsia-400 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-6 py-2 rounded-lg font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all shadow-[0_15px_40px_rgba(56,189,248,0.35)]"
              >
                Partner with Us
              </button>
            )}
          </div>
        )}
      </nav>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
