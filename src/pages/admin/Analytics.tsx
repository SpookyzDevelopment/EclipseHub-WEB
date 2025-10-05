import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Package, ShoppingBag } from 'lucide-react';
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

      const lastMonthOrders = orders.filter(
        (o) => new Date(o.created_at) >= lastMonth
      );
      const previousMonthOrders = orders.filter(
        (o) => new Date(o.created_at) < lastMonth
      );

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
        .map(order => ({
          id: order.id,
          total: order.amount,
          status: order.status,
          created_at: order.created_at
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
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Analytics</h1>
        </div>
        <p className="text-gray-400">Platform performance and insights</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{stats.revenueGrowth.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-400" />
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{stats.ordersGrowth.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalOrders}</p>
          <p className="text-sm text-gray-400">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalUsers}</p>
          <p className="text-sm text-gray-400">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalProducts}</p>
          <p className="text-sm text-gray-400">Total Products</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Top Products by Views</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg"
              >
                <span className="text-2xl font-bold text-gray-600">{index + 1}</span>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-400">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : order.status === 'processing'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
