import { Shield, Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartButton from './CartButton';
import AuthModal from './AuthModal';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products', icon: ShoppingBag },
  { label: 'Why Eclipse', section: 'services' },
  { label: 'Contact', section: 'contact' }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
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
      const element = document.querySelector(`#${sectionId}`);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050b16]/90 border-b border-white/10 shadow-[0_20px_45px_rgba(8,10,26,0.45)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20">
              <Shield className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Eclipse</p>
              <p className="text-xl font-semibold text-white">Commerce Studio</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href ? isActive(item.href) : false;
              const baseClasses = 'text-sm font-medium transition-colors relative flex items-center gap-2';

              if (item.section) {
                return (
                  <a
                    key={item.label}
                    href={`#${item.section}`}
                    onClick={(e) => scrollToSection(e, item.section!)}
                    className={`${baseClasses} text-slate-300 hover:text-white`}
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href!}
                  className={`${baseClasses} ${active ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                  {active && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-px bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400" />}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <NotificationBell />
            <CartButton />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400/40 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm text-white/80">{user.email?.split('@')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#050b16]/95 border border-white/10 shadow-[0_20px_60px_rgba(8,10,26,0.45)] p-2 animate-in">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10"
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
                className="btn-gradient px-5 py-2 rounded-lg text-sm font-semibold"
              >
                Become a Partner
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <CartButton />
            <button
              className="text-white"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 space-y-4 animate-in">
            <div className="grid gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                if (item.section) {
                  return (
                    <a
                      key={item.label}
                      href={`#${item.section}`}
                      onClick={(e) => scrollToSection(e, item.section!)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-300" />
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href!}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border border-white/10 ${
                      isActive(item.href!) ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  My Profile
                </Link>
                <Link to="/orders" className="block px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  My Orders
                </Link>
                <Link to="/wishlist" className="block px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  Wishlist
                </Link>
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full btn-gradient px-4 py-3 rounded-lg text-sm font-semibold"
              >
                Become a Partner
              </button>
            )}
          </div>
        )}
      </nav>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
