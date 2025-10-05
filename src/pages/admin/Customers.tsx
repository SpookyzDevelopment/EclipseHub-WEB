import { useState, useEffect } from 'react';
import { Users, Search, Mail, Calendar, DollarSign, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

interface Customer {
  id: string;
  email?: string;
  display_name?: string;
  created_at?: string;
  total_orders?: number;
  total_spent?: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info',
    link: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // ✅ Pull profiles only (public-friendly)
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: Customer[] = (profiles || []).map((p) => ({
        id: p.id,
        email: p.email || 'No email',
        display_name: p.display_name || 'Anonymous',
        created_at: p.created_at,
        total_orders: p.total_orders || 0,
        total_spent: Number(p.total_spent) || 0
      }));

      setCustomers(formatted);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerSelection = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id));
    }
  };

  const sendNotifications = async () => {
    if (!notificationData.title || !notificationData.message) {
      alert('Please fill in title and message');
      return;
    }

    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer');
      return;
    }

    setSending(true);

    try {
      const notifications = selectedCustomers.map((userId) => ({
        user_id: userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        link: notificationData.link || null,
        read: false
      }));

      const { error } = await supabase.from('notifications').insert(notifications);
      if (error) throw error;

      alert(`✅ Sent ${notifications.length} notification(s)!`);
      setShowNotificationModal(false);
      setNotificationData({ title: '', message: '', type: 'info', link: '' });
      setSelectedCustomers([]);
    } catch (err) {
      console.error('Error sending notifications:', err);
      alert('Failed to send notifications.');
    } finally {
      setSending(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const email = c.email?.toLowerCase() || '';
    const name = c.display_name?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return email.includes(q) || name.includes(q);
  });

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold">Customers</h1>
            </div>
            <p className="text-gray-400">Manage your customer base</p>
          </div>
          {selectedCustomers.length > 0 && (
            <button
              onClick={() => setShowNotificationModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
            >
              <Bell className="w-5 h-5" />
              Send Notification ({selectedCustomers.length})
            </button>
          )}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search customers by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.length === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                    onChange={selectAllCustomers}
                    className="w-4 h-4 rounded border-gray-700"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(c.id)}
                      onChange={() => toggleCustomerSelection(c.id)}
                      className="w-4 h-4 rounded border-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {(c.display_name?.charAt(0) || '?').toUpperCase()}
                      </div>
                      <p className="font-medium">{c.display_name || 'Anonymous'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{c.email || 'No email'}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{c.total_orders || 0}</td>
                  <td className="px-6 py-4 text-green-400 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{(c.total_spent || 0).toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchQuery
                ? 'No customers found matching your search'
                : 'No customers yet'}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Notification Modal */}
      {showNotificationModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Send Notification</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Notification Type
                </label>
                <select
                  value={notificationData.type}
                  onChange={(e) =>
                    setNotificationData({ ...notificationData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) =>
                    setNotificationData({ ...notificationData, title: e.target.value })
                  }
                  placeholder="Notification title..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) =>
                    setNotificationData({ ...notificationData, message: e.target.value })
                  }
                  placeholder="Your message..."
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Link (optional)</label>
                <input
                  type="text"
                  value={notificationData.link}
                  onChange={(e) =>
                    setNotificationData({ ...notificationData, link: e.target.value })
                  }
                  placeholder="/products"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                />
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  Sending to{' '}
                  <span className="font-bold text-white">
                    {selectedCustomers.length}
                  </span>{' '}
                  customer(s)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={sendNotifications}
                  disabled={sending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Notification'}
                </button>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
