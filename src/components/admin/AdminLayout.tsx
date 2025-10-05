import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Bell,
  FileText,
  LogOut,
  BarChart3,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, signOut } = useAdminAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/sales', icon: Tag, label: 'Sales' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      <nav className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="relative">
                <Shield className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gray-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
              <div>
                <span className="text-xl font-bold block">ALXNE Admin</span>
                <span className="text-xs text-gray-400">Control Panel</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{admin?.email}</p>
                <p className="text-xs text-gray-500">{admin?.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-gray-900/30 border-r border-gray-800 min-h-screen p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-gray-700 text-white border border-gray-600'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Quick Links</p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors block"
            >
              View Site →
            </a>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
