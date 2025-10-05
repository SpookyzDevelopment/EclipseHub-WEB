import { useEffect, useMemo, useState } from 'react';
import { Calendar, Check, Percent, Plus, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabaseDataService, Product, SalesCampaign } from '../../services/supabaseDataService';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Sales() {
  const [campaigns, setCampaigns] = useState<SalesCampaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsData, productsData] = await Promise.all([
        supabaseDataService.getSalesCampaigns(),
        supabaseDataService.getProducts(),
      ]);

      setCampaigns(campaignsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (campaign: Partial<SalesCampaign>) => {
    try {
      const newCampaign = await supabaseDataService.createSalesCampaign({
        name: campaign.name!,
        description: campaign.description,
        discount_percentage: campaign.discount_percentage!,
        start_date: campaign.start_date!,
        end_date: campaign.end_date!,
        active: campaign.active || false,
        product_ids: campaign.product_ids || [],
      });

      if (newCampaign) {
        fetchData();
        setShowCreateModal(false);
        alert('Campaign created successfully! It is now live on the website.');
      } else {
        alert('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const toggleCampaign = async (id: string, active: boolean) => {
    try {
      const updated = await supabaseDataService.updateSalesCampaign(id, { active: !active });

      if (updated) {
        fetchData();
        alert(`Campaign ${updated.active ? 'activated' : 'deactivated'} successfully! Changes are now live on the website.`);
      } else {
        alert('Failed to toggle campaign');
      }
    } catch (error) {
      console.error('Error toggling campaign:', error);
      alert('Failed to toggle campaign');
    }
  };

  const activeCampaigns = useMemo(() => campaigns.filter((c) => c.active).length, [campaigns]);

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
                <Tag className="h-4 w-4" />
                Sales studio
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Animate the next neon drop</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Launch targeted discount campaigns, orchestrate bundles, and keep the hype alive across eclipcestore.digital.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 text-right">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                {activeCampaigns} active campaigns
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-100 transition-all hover:border-purple-300 hover:bg-purple-500/20"
              >
                <Plus className="h-4 w-4" />
                New campaign
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-white">{campaign.name}</h2>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                        campaign.active
                          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                          : 'border-white/20 bg-black/30 text-white/50'
                      }`}
                    >
                      {campaign.active ? (
                        <ToggleRight className="h-3 w-3" />
                      ) : (
                        <ToggleLeft className="h-3 w-3" />
                      )}
                      {campaign.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="max-w-2xl text-sm text-white/60">{campaign.description}</p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">Discount</span>
                      <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-emerald-300">
                        <Percent className="h-5 w-5" />
                        {campaign.discount_percentage}%
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">Starts</span>
                      <p className="mt-2 flex items-center gap-2 text-white">
                        <Calendar className="h-4 w-4" />
                        {new Date(campaign.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">Ends</span>
                      <p className="mt-2 flex items-center gap-2 text-white">
                        <Calendar className="h-4 w-4" />
                        {new Date(campaign.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-4 text-xs uppercase tracking-[0.3em] text-white/50">
                    {campaign.product_ids.length} products in orbit
                  </div>
                </div>

                <button
                  onClick={() => toggleCampaign(campaign.id, campaign.active)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                    campaign.active
                      ? 'border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
                      : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                  }`}
                >
                  {campaign.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}

          {campaigns.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
              No campaigns yet. Launch your first neon promo.
            </div>
          )}
        </section>
      </div>

      {showCreateModal && (
        <CampaignModal
          products={products}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCampaign}
        />
      )}
    </AdminLayout>
  );
}

function CampaignModal({
  products,
  onClose,
  onSave,
}: {
  products: Product[];
  onClose: () => void;
  onSave: (campaign: Partial<SalesCampaign>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_percentage: 10,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    active: true,
    product_ids: [] as string[],
  });

  const toggleProduct = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(id)
        ? prev.product_ids.filter((pid) => pid !== id)
        : [...prev.product_ids, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 py-10 backdrop-blur" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#06001b] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold">Create campaign</h3>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/60 transition-all hover:border-white/30 hover:text-white"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Campaign name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Discount %</label>
              <input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                min={1}
                max={100}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Active</label>
              <select
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Draft</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Start date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">End date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Select products</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {products.map((product) => {
                const active = formData.product_ids.includes(product.id);
                return (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                      active
                        ? 'border-purple-400/40 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-black/40 text-white/70 hover:border-purple-400/40 hover:text-white'
                    }`}
                  >
                    <span>{product.name || 'Untitled product'}</span>
                    {active && <Check className="h-4 w-4 text-purple-100" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]"
            >
              Launch campaign
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
