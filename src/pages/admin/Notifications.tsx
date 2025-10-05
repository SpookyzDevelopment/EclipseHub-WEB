import { useState, useEffect } from 'react';
import { Bell, Send, Users, User } from 'lucide-react';
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
          created_at: new Date().toISOString()
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
        if (error) throw error;
      }

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

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold">Notifications</h1>
        </div>
        <p className="text-gray-400">Send notifications to your users</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-3">Recipients</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="recipient"
                    value="all"
                    checked={formData.recipient === 'all'}
                    onChange={(e) =>
                      setFormData({ ...formData, recipient: e.target.value as 'all' })
                    }
                    className="peer sr-only"
                  />
                  <div className="p-4 border border-gray-700 rounded-lg cursor-pointer peer-checked:border-purple-500 peer-checked:bg-purple-500/10 transition-all">
                    <Users className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="font-medium">All Users</p>
                    <p className="text-sm text-gray-400">{users.length} recipients</p>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="recipient"
                    value="specific"
                    checked={formData.recipient === 'specific'}
                    onChange={(e) =>
                      setFormData({ ...formData, recipient: e.target.value as 'specific' })
                    }
                    className="peer sr-only"
                  />
                  <div className="p-4 border border-gray-700 rounded-lg cursor-pointer peer-checked:border-purple-500 peer-checked:bg-purple-500/10 transition-all">
                    <User className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="font-medium">Specific User</p>
                    <p className="text-sm text-gray-400">Select below</p>
                  </div>
                </label>
              </div>
            </div>

            {formData.recipient === 'specific' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select User</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                  required
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Notification Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
              >
                <option value="announcement">Announcement</option>
                <option value="promotion">Promotion</option>
                <option value="update">Update</option>
                <option value="alert">Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                placeholder="e.g., New Feature Available!"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none resize-none"
                placeholder="Your notification message..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Link (Optional)</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                placeholder="/products or https://..."
              />
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="font-medium mb-2">Preview</h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="font-medium mb-1">{formData.title || 'Notification Title'}</p>
                <p className="text-sm text-gray-400">
                  {formData.message || 'Your message will appear here...'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
