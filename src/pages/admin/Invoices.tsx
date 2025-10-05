import { useState, useEffect } from 'react';
import { FileText, Plus, DollarSign, Calendar } from 'lucide-react';
import { dataService } from '../../services/dataService';
import AdminLayout from '../../components/admin/AdminLayout';

interface Invoice {
  id: string;
  user_id: string;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  paid_at: string | null;
  user_email?: string;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    try {
      const orders = dataService.getOrders();
      const customers = dataService.getCustomers();

      const invoiceData: Invoice[] = orders.map(order => ({
        id: order.id,
        user_id: order.user_id,
        stripe_invoice_id: null,
        amount: order.amount,
        currency: 'usd',
        status: order.status === 'completed' ? 'paid' : 'pending',
        description: order.product_name,
        created_at: order.created_at,
        paid_at: order.status === 'completed' ? order.created_at : null,
        user_email: order.user_email
      }));

      setInvoices(invoiceData);
      setUsers(customers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = (invoice: Partial<Invoice>) => {
    try {
      const invoicesData = localStorage.getItem('invoices');
      const invoices = invoicesData ? JSON.parse(invoicesData) : [];

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        user_id: invoice.user_id!,
        stripe_invoice_id: null,
        amount: invoice.amount!,
        currency: invoice.currency!,
        status: invoice.status!,
        description: invoice.description!,
        created_at: new Date().toISOString(),
        paid_at: null,
        user_email: users.find(u => u.id === invoice.user_id)?.email || 'Unknown'
      };

      invoices.push(newInvoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));

      fetchData();
      setShowCreateModal(false);
      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl font-bold">Invoices</h1>
            </div>
            <p className="text-gray-400">Create and manage customer invoices</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-400 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Description</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium">{invoice.user_email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-green-400 font-medium">
                      <DollarSign className="w-4 h-4" />
                      {invoice.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : invoice.status === 'draft'
                          ? 'bg-gray-500/20 text-gray-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{invoice.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">No invoices yet</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <InvoiceModal
          users={users}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateInvoice}
        />
      )}
    </AdminLayout>
  );
}

function InvoiceModal({
  users,
  onClose,
  onSave,
}: {
  users: any[];
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
}) {
  const [formData, setFormData] = useState({
    user_id: '',
    amount: 0,
    currency: 'usd',
    status: 'draft',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Customer</label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
              required
            >
              <option value="">Select a customer...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none resize-none"
              placeholder="Invoice description..."
              required
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              Note: This creates a draft invoice. Integration with Stripe payment processing can be
              added for automatic payment collection.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-400 transition-all"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
