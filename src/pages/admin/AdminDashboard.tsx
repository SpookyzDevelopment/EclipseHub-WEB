import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Bell,
  Tag,
  FileText,
  BarChart3,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your platform</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalUsers}</p>
          <p className="text-sm text-gray-400">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalOrders}</p>
          <p className="text-sm text-gray-400">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold mb-1">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalProducts}</p>
          <p className="text-sm text-gray-400">Total Products</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold">Active Notifications</h3>
          </div>
          <p className="text-2xl font-bold">{stats.activeNotifications}</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold">Active Sales</h3>
          </div>
          <p className="text-2xl font-bold">{stats.activeSales}</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold">Pending Tickets</h3>
          </div>
          <p className="text-2xl font-bold">{stats.pendingTickets}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/customers')}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all text-left"
          >
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <p className="font-medium">Manage Customers</p>
            <p className="text-sm text-gray-400 mt-1">View and edit customer data</p>
          </button>

          <button
            onClick={() => navigate('/admin/products')}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all text-left"
          >
            <Package className="w-6 h-6 text-green-400 mb-2" />
            <p className="font-medium">Manage Products</p>
            <p className="text-sm text-gray-400 mt-1">Add, edit, or remove products</p>
          </button>

          <button
            onClick={() => navigate('/admin/sales')}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all text-left"
          >
            <Tag className="w-6 h-6 text-red-400 mb-2" />
            <p className="font-medium">Manage Sales</p>
            <p className="text-sm text-gray-400 mt-1">Create discount campaigns</p>
          </button>

          <button
            onClick={() => navigate('/admin/notifications')}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all text-left"
          >
            <Bell className="w-6 h-6 text-purple-400 mb-2" />
            <p className="font-medium">Send Notifications</p>
            <p className="text-sm text-gray-400 mt-1">Notify users about updates</p>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
