import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = () => {
    try {
      const orders = dataService.getOrders();
      const customers = dataService.getCustomers();
      const products = dataService.getProducts();

      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const lastMonthOrders = orders.filter((o) => new Date(o.created_at) >= lastMonth);
      const previousMonthOrders = orders.filter((o) => new Date(o.created_at) < lastMonth);

      const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.amount, 0);
      const previousMonthRevenue = previousMonthOrders.reduce((sum, o) => sum + o.amount, 0);

      const revenueGrowth = previousMonthRevenue > 0
        ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

      const ordersGrowth = previousMonthOrders.length > 0
        ? ((lastMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100
        : 0;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: customers.length,
        totalProducts: products.length,
        revenueGrowth,
        ordersGrowth,
      });

      const topProductsData = products.slice(0, 5);
      setTopProducts(topProductsData);

      const recentOrdersData = orders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((order) => ({
          id: order.id,
          total: order.amount,
          status: order.status,
          created_at: order.created_at,
        }));

      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040011]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 m-auto h-20 w-20 animate-spin rounded-full border-4 border-t-purple-400/80 border-transparent" />
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-fuchsia-900/20 to-transparent p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100">
                <BarChart3 className="h-4 w-4" />
                Insight lab
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Illuminate marketplace performance</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Keep a pulse on neon commerce metrics, identify winning drops, and fine-tune the journey across eclipcestore.digital.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/70">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Velocity snapshot</p>
              <div className="mt-3 flex items-center gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">{stats.totalOrders}</p>
                  <p className="text-xs text-white/50">Orders processed</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-emerald-300">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-white/50">Revenue to date</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-purple-100">
                <Activity className="h-4 w-4" />
                Live data refreshed every deployment
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Revenue surge"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            delta={`${stats.revenueGrowth.toFixed(1)}%`}
            icon={DollarSign}
          />
          <MetricCard
            title="Order flow"
            value={stats.totalOrders}
            delta={`${stats.ordersGrowth.toFixed(1)}%`}
            icon={ShoppingBag}
          />
          <MetricCard title="Community size" value={stats.totalUsers} delta="+12.4%" icon={Users} />
          <MetricCard title="Catalog depth" value={stats.totalProducts} delta="Stable" icon={Package} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Top products</p>
                <h2 className="mt-2 text-2xl font-semibold">Most magnetic drops</h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/50" />
            </div>

            <div className="mt-6 space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <span className="text-2xl font-semibold text-white/30">{index + 1}</span>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">${product.price}</p>
                  </div>
                  <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-100">
                    Featured
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Latest orders</p>
            <h2 className="mt-2 text-2xl font-semibold">Live commerce feed</h2>
            <div className="mt-6 space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>${order.total.toFixed(2)}</span>
                    <span className="text-xs text-white/40">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                      order.status === 'completed'
                        ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                        : order.status === 'processing'
                        ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                        : 'border-white/20 bg-black/30 text-white/50'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Conversion pulse</p>
            <div className="mt-4 space-y-4">
              {[65, 82, 45].map((value, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{['Landing to cart', 'Cart to checkout', 'Checkout to success'][index]}</span>
                    <span className="text-purple-100">{value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Traffic mix</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center justify-between">
                <span>Direct</span>
                <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-100">45%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Social</span>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">32%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Referral</span>
                <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">18%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Paid</span>
                <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs text-rose-100">5%</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Next experiments</p>
            <div className="mt-4 space-y-4 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">Test holo-checkout</p>
                <p className="text-xs text-white/50">Prototype the holographic payment interface for VIP members.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">Boost drop reminders</p>
                <p className="text-xs text-white/50">Increase pre-launch notification cadence for high-interest drops.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">Refine loyalty tiers</p>
                <p className="text-xs text-white/50">Align reward ratios with current retention goals.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  title,
  value,
  delta,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  delta: string;
  icon: any;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between text-white/70">
          <p className="text-xs uppercase tracking-[0.3em]">{title}</p>
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-100">
          <TrendingUp className="h-3 w-3" />
          {delta}
        </span>
      </div>
    </div>
  );
}
