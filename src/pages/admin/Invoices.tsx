import { useEffect, useMemo, useState } from 'react';
import { Calendar, DollarSign, FileText, Plus, Sparkles } from 'lucide-react';
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

      const invoiceData: Invoice[] = orders.map((order) => ({
        id: order.id,
        user_id: order.user_id,
        stripe_invoice_id: null,
        amount: order.amount,
        currency: 'usd',
        status: order.status === 'completed' ? 'paid' : 'pending',
        description: order.product_name,
        created_at: order.created_at,
        paid_at: order.status === 'completed' ? order.created_at : null,
        user_email: order.user_email,
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
      const storedInvoices = invoicesData ? JSON.parse(invoicesData) : [];

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
        user_email: users.find((u) => u.id === invoice.user_id)?.email || 'Unknown',
      };

      storedInvoices.push(newInvoice);
      localStorage.setItem('invoices', JSON.stringify(storedInvoices));

      fetchData();
      setShowCreateModal(false);
      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    }
  };

  const totalOutstanding = useMemo(
    () => invoices.filter((i) => i.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    [invoices]
  );

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
                <FileText className="h-4 w-4" />
                Billing hub
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Manage statement flow</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Generate, monitor, and reconcile invoices to keep the neon commerce ledger precise.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 text-right">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                Outstanding ${totalOutstanding.toFixed(2)}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-100 transition-all hover:border-purple-300 hover:bg-purple-500/20"
              >
                <Plus className="h-4 w-4" />
                Create invoice
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-white/50">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="bg-black/30 transition-colors hover:bg-purple-500/5">
                      <td className="px-6 py-4 text-white">{invoice.user_email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
                          <DollarSign className="h-3 w-3" />
                          {invoice.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                            invoice.status === 'paid'
                              ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                              : invoice.status === 'draft'
                              ? 'border-white/20 bg-black/30 text-white/50'
                              : 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70">{invoice.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="h-4 w-4" />
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {invoices.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-white/60">
                <FileText className="h-12 w-12 text-white/30" />
                <p>No invoices yet</p>
              </div>
            )}
          </div>
        </section>
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
    amount: '',
    currency: 'usd',
    status: 'draft',
    description: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      user_id: formData.user_id,
      amount: Number(formData.amount),
      currency: formData.currency,
      status: formData.status,
      description: formData.description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 py-10 backdrop-blur" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#06001b] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold">Create invoice</h3>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/60 transition-all hover:border-white/30 hover:text-white"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Customer</label>
            <select
              value={formData.user_id}
              onChange={(e) => handleChange('user_id', e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Currency</label>
              <input
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Description</label>
              <input
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]"
            >
              <Sparkles className="h-4 w-4" />
              Save invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-black/40 px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/30 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
