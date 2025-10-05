import { ReactNode, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, signOut } = useAdminAuth();

  const navItems = useMemo(
    () => [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Command Deck' },
      { path: '/admin/customers', icon: Users, label: 'Customers' },
      { path: '/admin/products', icon: Package, label: 'Products' },
      { path: '/admin/sales', icon: Tag, label: 'Sales Studio' },
      { path: '/admin/notifications', icon: Bell, label: 'Signal Center' },
      { path: '/admin/invoices', icon: FileText, label: 'Billing' },
      { path: '/admin/analytics', icon: BarChart3, label: 'Insights' },
    ],
    []
  );

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040011] text-white">
      <div className="pointer-events-none absolute -top-48 -right-40 h-[36rem] w-[36rem] rounded-full bg-purple-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-28 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl lg:flex">
          <div className="flex-1 overflow-y-auto px-8 pt-10 pb-8">
            <Link to="/admin/dashboard" className="group block">
              <div className="relative mb-8 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-300 group-hover:border-purple-400/60 group-hover:shadow-[0_0_45px_rgba(168,85,247,0.4)]">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-500">
                    <Shield className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
                      Eclipse
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-200/80">Admin Nexus</p>
                    <p className="text-2xl font-semibold">Eclipcestore.digital</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-purple-100/80">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Neon control suite
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 font-medium">v3.2</span>
                </div>
              </div>
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? 'border-purple-500/60 bg-purple-500/10 text-white shadow-[0_0_35px_rgba(168,85,247,0.35)]'
                        : 'border-white/5 text-white/60 hover:border-purple-400/40 hover:bg-purple-500/5 hover:text-white'
                    }`}
                  >
                    <span
                      className={`absolute left-2 h-8 w-1 rounded-full transition-all ${
                        active
                          ? 'bg-gradient-to-b from-purple-400 to-fuchsia-500 opacity-100'
                          : 'bg-gradient-to-b from-purple-400/40 to-fuchsia-500/40 opacity-0 group-hover:opacity-60'
                      }`}
                    />
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-8 pb-12">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-purple-100/70">Operations pulse</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-xl font-semibold text-white">99.3%</p>
                  <p className="text-white/60">Platform uptime</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs font-medium text-purple-200">
                  <Activity className="h-4 w-4" />
                  Live
                </div>
              </div>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-purple-200 transition-colors hover:text-white"
              >
                View storefront
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06001b]/80 px-6 py-5 backdrop-blur-2xl lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Welcome back</p>
                  <p className="text-lg font-semibold">{admin?.email || 'Eclipse Admin'}</p>
                  <p className="text-xs text-white/40">{admin?.role || 'Super Admin'} · eclipcestore.digital</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-100 transition-all hover:border-purple-300 hover:bg-purple-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  Launch storefront
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-red-400/40 hover:bg-red-500/10 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <div className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={`mobile-${item.path}`}
                    to={item.path}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'border-purple-400/60 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-black/40 text-white/60 hover:border-purple-400/40 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1 px-6 py-8 lg:px-10 lg:py-12">
            <div className="mx-auto w-full max-w-7xl space-y-10">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
