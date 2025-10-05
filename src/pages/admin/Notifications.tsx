import { useEffect, useMemo, useState } from 'react';
import { Bell, Send, Users, User, Sparkles } from 'lucide-react';
import { dataService } from '../../services/dataService';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Notifications() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: 'all' as 'all' | 'specific',
    user_id: '',
    type: 'announcement',
    title: '',
    message: '',
    link: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    try {
      const customers = dataService.getCustomers();
      setUsers(customers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const notificationsData = localStorage.getItem('notifications');
      const notifications = notificationsData ? JSON.parse(notificationsData) : [];

      if (formData.recipient === 'all') {
        const newNotifications = users.map((user) => ({
          id: `${Date.now()}-${user.id}`,
          user_id: user.id,
          type: formData.type,
          title: formData.title,
          message: formData.message,
          link: formData.link || null,
          read: false,
          created_at: new Date().toISOString(),
        }));

        notifications.push(...newNotifications);
      } else {
        notifications.push({
          user_id: formData.user_id,
          type: formData.type,
          title: formData.title,
          message: formData.message,
          link: formData.link || null,
          read: false,
        });
      }

      localStorage.setItem('notifications', JSON.stringify(notifications));
      alert('Notification(s) sent successfully!');
      setFormData({
        recipient: 'all',
        user_id: '',
        type: 'announcement',
        title: '',
        message: '',
        link: '',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const audienceSize = useMemo(() => (formData.recipient === 'all' ? users.length : 1), [formData.recipient, users.length]);

  return (
    <AdminLayout>
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-fuchsia-900/20 to-transparent p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100">
                <Bell className="h-4 w-4" />
                Signal center
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Broadcast neon updates</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Reach every corner of the Eclipse Hub community with targeted announcements, promotions, and experience alerts.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-right text-sm text-white/60">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Audience ready</p>
              <p className="mt-2 text-3xl font-semibold text-white">{users.length}</p>
              <p className="text-xs text-white/50">Total reachable profiles</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Who should receive this signal?</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <RecipientCard
                  icon={Users}
                  label="All users"
                  description={`${users.length} recipients`}
                  selected={formData.recipient === 'all'}
                  onSelect={() => setFormData({ ...formData, recipient: 'all', user_id: '' })}
                />
                <RecipientCard
                  icon={User}
                  label="Specific user"
                  description="Select below"
                  selected={formData.recipient === 'specific'}
                  onSelect={() => setFormData({ ...formData, recipient: 'specific' })}
                />
              </div>
            </div>

            {formData.recipient === 'specific' && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  Choose a recipient
                </label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Notification type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                >
                  <option value="announcement">Announcement</option>
                  <option value="promotion">Promotion</option>
                  <option value="update">Update</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Link (optional)</label>
                <input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/products or https://..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., New Feature Available!"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                placeholder="Your notification message..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/60">
                <Sparkles className="mr-2 inline h-4 w-4 text-purple-200" />
                Audience size: <span className="font-semibold text-white">{audienceSize}</span> recipient(s)
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending…' : 'Launch signal'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}

function RecipientCard({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
}: {
  icon: any;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${
        selected
          ? 'border-purple-400/40 bg-purple-500/10 text-white'
          : 'border-white/10 bg-black/40 text-white/70 hover:border-purple-400/40 hover:text-white'
      }`}
    >
      <div className="rounded-2xl border border-purple-400/40 bg-purple-500/10 p-3 text-purple-100">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-white/60">{description}</p>
      </div>
    </button>
  );
}
