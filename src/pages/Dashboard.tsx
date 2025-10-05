import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Key,
  Heart,
  Star,
  TrendingUp,
  Package,
  Copy,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeLicenses: number;
  wishlistItems: number;
  reviewsCount: number;
}

interface License {
  id: string;
  license_key: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  products: {
    id: string;
    name: string;
    image_url: string;
    is_digital: boolean;
    max_activations: number;
  };
  activations_count?: number;
}

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  created_at: string;
  order_items: {
    products: {
      name: string;
      image_url: string;
    };
  }[];
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    activeLicenses: 0,
    wishlistItems: 0,
    reviewsCount: 0
  });
  const [licenses, setLicenses] = useState<License[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [ordersData, licensesData, wishlistData, reviewsData] = await Promise.all([
        supabase.from('orders').select('total').eq('user_id', user!.id),
        supabase.from('licenses').select(`
          id,
          license_key,
          status,
          created_at,
          expires_at,
          products (
            id,
            name,
            image_url,
            is_digital,
            max_activations
          )
        `).eq('user_id', user!.id).order('created_at', { ascending: false }),
        supabase.from('wishlists').select('id').eq('user_id', user!.id),
        supabase.from('reviews').select('id').eq('user_id', user!.id)
      ]);

      const totalSpent = ordersData.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const activeLicenses = licensesData.data?.filter(l => l.status === 'active').length || 0;

      setStats({
        totalOrders: ordersData.data?.length || 0,
        totalSpent,
        activeLicenses,
        wishlistItems: wishlistData.data?.length || 0,
        reviewsCount: reviewsData.data?.length || 0
      });

      const licensesWithActivations = await Promise.all(
        (licensesData.data || []).map(async (license) => {
          const { count } = await supabase
            .from('license_activations')
            .select('*', { count: 'exact', head: true })
            .eq('license_id', license.id);

          return {
            ...license,
            activations_count: count || 0
          };
        })
      );

      setLicenses(licensesWithActivations);

      const { data: ordersWithItems } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          status,
          created_at,
          order_items (
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentOrders(ordersWithItems || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (licenseId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(licenseId)) {
        newSet.delete(licenseId);
      } else {
        newSet.add(licenseId);
      }
      return newSet;
    });
  };

  const maskLicenseKey = (key: string) => {
    const parts = key.split('-');
    return parts.map((part, index) =>
      index === 0 || index === parts.length - 1 ? part : '****'
    ).join('-');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <LayoutDashboard className="w-8 h-8 text-gray-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-400">Welcome back, {user.email?.split('@')[0]}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 text-blue-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalOrders}</p>
            <p className="text-sm text-gray-400">Total Orders</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-3xl font-bold mb-1">${stats.totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Total Spent</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Key className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.activeLicenses}</p>
            <p className="text-sm text-gray-400">Active Licenses</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.wishlistItems}</p>
            <p className="text-sm text-gray-400">Wishlist Items</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.reviewsCount}</p>
            <p className="text-sm text-gray-400">Reviews Written</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Key className="w-6 h-6 text-yellow-400" />
                  My Licenses
                </h2>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors text-sm">
                  View All Orders →
                </Link>
              </div>

              {licenses.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-12 text-center">
                  <Key className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No licenses yet</p>
                  <Link
                    to="/products"
                    className="inline-block bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {licenses.map((license) => (
                    <div
                      key={license.id}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all"
                    >
                      <div className="flex gap-4 mb-4">
                        <img
                          src={license.products.image_url}
                          alt={license.products.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/products/${license.products.id}`}
                            className="font-bold text-lg hover:text-gray-300 transition-colors"
                          >
                            {license.products.name}
                          </Link>
                          <p className="text-sm text-gray-400 mb-2">
                            Purchased on {new Date(license.created_at).toLocaleDateString()}
                          </p>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            license.status === 'active'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {license.status === 'active' ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>Expired</>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">License Key</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleKeyVisibility(license.id)}
                              className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                              title={visibleKeys.has(license.id) ? "Hide key" : "Show key"}
                            >
                              {visibleKeys.has(license.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyLicenseKey(license.license_key)}
                              className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                              title="Copy license key"
                            >
                              {copiedKey === license.license_key ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <code className="text-lg font-mono text-white block">
                          {visibleKeys.has(license.id)
                            ? license.license_key
                            : maskLicenseKey(license.license_key)
                          }
                        </code>
                        <div className="mt-3 text-xs text-gray-500">
                          Activations: {license.activations_count || 0} / {license.products.max_activations}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
                Recent Orders
              </h2>

              {recentOrders.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-8 text-center">
                  <Package className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {order.order_items[0] && (
                          <img
                            src={order.order_items[0].products.image_url}
                            alt={order.order_items[0].products.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {order.order_items[0]?.products.name}
                            {order.order_items.length > 1 && ` +${order.order_items.length - 1} more`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'processing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/orders"
                className="block mt-4 text-center py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                View All Orders
              </Link>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                Quick Links
              </h2>

              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block p-4 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                >
                  <p className="font-medium">My Profile</p>
                  <p className="text-sm text-gray-400">Manage account settings</p>
                </Link>

                <Link
                  to="/wishlist"
                  className="block p-4 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                >
                  <p className="font-medium">Wishlist</p>
                  <p className="text-sm text-gray-400">{stats.wishlistItems} saved items</p>
                </Link>

                <Link
                  to="/products"
                  className="block p-4 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                >
                  <p className="font-medium">Browse Products</p>
                  <p className="text-sm text-gray-400">Discover new items</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
