import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bolt,
  DollarSign,
  Package,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { dataService } from '../../services/dataService';
import AdminLayout from '../../components/admin/AdminLayout';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeNotifications: number;
  activeSales: number;
  pendingTickets: number;
}

const pulseStages = [
  {
    label: 'Product drops',
    description: 'New neon collections moving through QA',
    progress: 72,
    tone: 'from-purple-500 via-fuchsia-500 to-indigo-500',
  },
  {
    label: 'Order fulfillment',
    description: 'Same-day dispatch commitments',
    progress: 64,
    tone: 'from-cyan-400 via-blue-500 to-violet-500',
  },
  {
    label: 'Support tickets',
    description: 'Community requests awaiting replies',
    progress: 38,
    tone: 'from-amber-400 via-orange-500 to-rose-500',
  },
];

const runwayHighlights = [
  {
    title: 'Live campaigns',
    stat: '3',
    subtext: 'Neon bundles running',
  },
  {
    title: 'Low stock alerts',
    stat: '7',
    subtext: 'Variants below threshold',
  },
  {
    title: 'Avg. response',
    stat: '1h 12m',
    subtext: 'Support pulse time',
  },
];

export default function AdminDashboard() {
  const { admin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeNotifications: 0,
    activeSales: 0,
    pendingTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchStats();
    }
  }, [admin]);

  const fetchStats = () => {
    try {
      const products = dataService.getProducts();
      const orders = dataService.getOrders();
      const customers = dataService.getCustomers();

      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

      setStats({
        totalUsers: customers.length,
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        activeNotifications: 0,
        activeSales: 0,
        pendingTickets: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040011]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 m-auto h-20 w-20 animate-spin rounded-full border-4 border-t-purple-400/80 border-transparent" />
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const commandMetrics = [
    {
      title: 'Customer orbit',
      value: stats.totalUsers,
      delta: '+12.4%',
      tone: 'from-purple-500/30 to-purple-500/5',
      icon: Users,
      caption: 'vs. last 30 days',
    },
    {
      title: 'Orders dispatched',
      value: stats.totalOrders,
      delta: '+4.1%',
      tone: 'from-indigo-500/30 to-indigo-500/5',
      icon: Package,
      caption: 'processed all time',
    },
    {
      title: 'Revenue to date',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      delta: '+8.6%',
      tone: 'from-emerald-500/30 to-emerald-500/5',
      icon: DollarSign,
      caption: 'lifetime volume',
    },
    {
      title: 'Catalog active',
      value: stats.totalProducts,
      delta: 'Stable',
      tone: 'from-fuchsia-500/30 to-fuchsia-500/5',
      icon: BarChart3,
      caption: 'live SKUs',
    },
  ];

  const operationalGrid = [
    {
      title: 'Signal Center',
      value: stats.activeNotifications,
      hint: 'Broadcasts primed',
      icon: Bell,
      cta: () => navigate('/admin/notifications'),
    },
    {
      title: 'Sales Studio',
      value: stats.activeSales,
      hint: 'Campaigns in orbit',
      icon: Target,
      cta: () => navigate('/admin/sales'),
    },
    {
      title: 'Support queue',
      value: stats.pendingTickets,
      hint: 'Tickets on deck',
      icon: Radar,
      cta: () => navigate('/admin/customers'),
    },
  ];

  const quickActions = [
    {
      label: 'Spin up product',
      description: 'Launch a new neon experience',
      onClick: () => navigate('/admin/products'),
    },
    {
      label: 'Surprise the hive',
      description: 'Send a custom drop notification',
      onClick: () => navigate('/admin/notifications'),
    },
    {
      label: 'Review performance',
      description: 'Dive into marketplace analytics',
      onClick: () => navigate('/admin/analytics'),
    },
    {
      label: 'Fine-tune promos',
      description: 'Adjust active discounts & bundles',
      onClick: () => navigate('/admin/sales'),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/60 via-fuchsia-900/40 to-transparent p-10 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
          <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-20 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100">
                <Sparkles className="h-4 w-4" />
                Command Deck
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
                Eclipse Hub operations, fully illuminated.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-purple-100/80 sm:text-base">
                Monitor every beat of the neon marketplace from this unified control surface. Track growth, trigger campaigns, and choreograph dazzling drops for eclipcestore.digital.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {runwayHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-100/50">{item.title}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{item.stat}</p>
                    <p className="mt-1 text-xs text-white/60">{item.subtext}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-purple-100/50">
                <Activity className="h-4 w-4" />
                Live mission health
              </p>
              <div className="mt-6 space-y-4">
                {pulseStages.map((stage) => (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <div>
                        <p className="font-semibold text-white">{stage.label}</p>
                        <p className="text-xs text-white/50">{stage.description}</p>
                      </div>
                      <span className="font-semibold text-purple-100">{stage.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stage.tone}`}
                        style={{ width: `${stage.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
          {commandMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${metric.tone} p-6 transition-transform duration-300 hover:-translate-y-1`}
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.title}</p>
                    <Icon className="h-6 w-6 text-white/70" />
                  </div>
                  <p className="mt-5 text-3xl font-semibold text-white">{metric.value}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-purple-100">
                      <TrendingUp className="h-3 w-3" />
                      {metric.delta}
                    </span>
                    <span>{metric.caption}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Operational control</p>
                <h2 className="mt-2 text-2xl font-semibold">Mission-critical panels</h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/50" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {operationalGrid.map((panel) => {
                const Icon = panel.icon;
                return (
                  <button
                    key={panel.title}
                    onClick={panel.cta}
                    className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-purple-400/40 hover:bg-purple-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-3 text-purple-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Bolt className="h-4 w-4 text-purple-100/70 transition-transform group-hover:-translate-y-1" />
                    </div>
                    <p className="mt-6 text-3xl font-semibold text-white">{panel.value}</p>
                    <p className="mt-1 text-sm font-medium text-white/80">{panel.title}</p>
                    <p className="mt-1 text-xs text-white/50">{panel.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quick deploy</p>
            <h2 className="mt-2 text-2xl font-semibold">Instant actions</h2>
            <div className="mt-6 space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex w-full items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-purple-400/40 hover:bg-purple-500/10"
                >
                  <div>
                    <p className="font-medium text-white">{action.label}</p>
                    <p className="text-xs text-white/50">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-purple-100" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Growth velocity</p>
            <div className="mt-4 space-y-4">
              {[45, 62, 80].map((value, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{['Acquisition', 'Conversion', 'Retention'][index]}</span>
                    <span className="text-purple-100">{value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Experience radar</p>
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              <li className="flex items-center justify-between">
                <span>Checkout success</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">
                  98%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Average basket</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-purple-200">
                  $124
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Repeat visitors</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-blue-200">
                  64%
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Next focus</p>
            <div className="mt-4 space-y-4 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-white">Prime the Aurora Drop</p>
                <p className="text-xs text-white/50">Schedule teaser assets before Friday midnight.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-white">Refresh loyalty perks</p>
                <p className="text-xs text-white/50">Align with the new neon membership tiers.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-white">Audit payment routing</p>
                <p className="text-xs text-white/50">Ensure express checkout stays under 1.5s.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
