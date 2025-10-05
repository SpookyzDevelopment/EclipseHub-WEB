import { useEffect, useMemo, useState } from 'react';
import { Bell, Calendar, DollarSign, Mail, Search, Users } from 'lucide-react';
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
    link: '',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
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
        total_spent: Number(p.total_spent) || 0,
      }));

      setCustomers(formatted);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customers.filter((c) => {
      const email = c.email?.toLowerCase() || '';
      const name = c.display_name?.toLowerCase() || '';
      return email.includes(q) || name.includes(q);
    });
  }, [customers, searchQuery]);

  const totalSpend = filteredCustomers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const vipCount = filteredCustomers.filter((c) => (c.total_spent || 0) > 500).length;

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
        read: false,
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
                <Users className="h-4 w-4" />
                Customer galaxy
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Community orbit overview</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Segment the Eclipse Hub audience, broadcast neon updates, and keep loyalty pulses vibrant across eclipcestore.digital.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Active profiles</p>
                <p className="mt-2 text-2xl font-semibold text-white">{customers.length}</p>
                <p className="text-xs text-white/50">Total registered</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">VIP spenders</p>
                <p className="mt-2 text-2xl font-semibold text-white">{vipCount}</p>
                <p className="text-xs text-white/50">&gt; $500 lifetime</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Lifetime value</p>
                <p className="mt-2 text-2xl font-semibold text-white">${totalSpend.toFixed(2)}</p>
                <p className="text-xs text-white/50">Filtered total</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search customers by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-12 py-3 text-sm text-white focus:border-purple-400/60 focus:outline-none"
              />
            </div>

            {selectedCustomers.length > 0 && (
              <button
                onClick={() => setShowNotificationModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-100 transition-all hover:border-purple-300 hover:bg-purple-500/20"
              >
                <Bell className="h-4 w-4" />
                Send broadcast ({selectedCustomers.length})
              </button>
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-white/50">
                  <tr>
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedCustomers.length === filteredCustomers.length &&
                          filteredCustomers.length > 0
                        }
                        onChange={selectAllCustomers}
                        className="h-4 w-4 rounded border-white/30 bg-black/40"
                      />
                    </th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Orders</th>
                    <th className="px-6 py-4">Total spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="bg-black/20 transition-colors hover:bg-purple-500/5">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(c.id)}
                          onChange={() => toggleCustomerSelection(c.id)}
                          className="h-4 w-4 rounded border-white/30 bg-black/40"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-semibold text-white">
                            {(c.display_name?.charAt(0) || '?').toUpperCase()}
                          </div>
                          <p className="font-medium text-white">{c.display_name || 'Anonymous'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/70">
                          <Mail className="h-4 w-4" />
                          <span>{c.email || 'No email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {c.created_at
                              ? new Date(c.created_at).toLocaleDateString()
                              : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/80">{c.total_orders || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-emerald-300">
                          <DollarSign className="h-4 w-4" />
                          <span>{(c.total_spent || 0).toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-white/60">
                <Users className="h-12 w-12 text-white/30" />
                <p>
                  {searchQuery
                    ? 'No customers found matching your search'
                    : 'No customers yet'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {showNotificationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 py-10 backdrop-blur"
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#06001b] p-8 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Signal broadcast</p>
                <h2 className="mt-2 text-2xl font-semibold">Send customer notification</h2>
              </div>
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-100">
                {selectedCustomers.length} recipients
              </span>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  Notification type
                </label>
                <select
                  value={notificationData.type}
                  onChange={(e) =>
                    setNotificationData({ ...notificationData, type: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationData.title}
                    onChange={(e) =>
                      setNotificationData({ ...notificationData, title: e.target.value })
                    }
                    placeholder="Notification title..."
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Message
                  </label>
                  <textarea
                    value={notificationData.message}
                    onChange={(e) =>
                      setNotificationData({ ...notificationData, message: e.target.value })
                    }
                    placeholder="Your message..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Link (optional)
                  </label>
                  <input
                    type="text"
                    value={notificationData.link}
                    onChange={(e) =>
                      setNotificationData({ ...notificationData, link: e.target.value })
                    }
                    placeholder="/products"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                Sending to <span className="font-semibold text-white">{selectedCustomers.length}</span> customer(s)
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={sendNotifications}
                  disabled={sending}
                  className="flex-1 rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? 'Sending…' : 'Send notification'}
                </button>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/30 hover:text-white"
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
