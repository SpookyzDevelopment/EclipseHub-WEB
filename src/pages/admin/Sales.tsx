import { useState, useEffect } from 'react';
import { Tag, Plus, Calendar, Percent, Check, X } from 'lucide-react';
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
        supabaseDataService.getProducts()
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
        product_ids: campaign.product_ids || []
      });

      if (newCampaign) {
        console.log('✅ Sales campaign created:', newCampaign.name);
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
        console.log('✅ Sales campaign toggled:', updated.name, '- Active:', updated.active);
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
              <Tag className="w-8 h-8 text-red-400" />
              <h1 className="text-4xl font-bold">Sales & Discounts</h1>
            </div>
            <p className="text-gray-400">Create and manage discount campaigns</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-500 hover:to-red-400 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{campaign.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.active
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {campaign.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{campaign.description}</p>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-red-400" />
                    <span className="text-sm">
                      <span className="font-bold text-red-400">{campaign.discount_percentage}%</span>{' '}
                      off
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(campaign.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    {campaign.product_ids.length} products included
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleCampaign(campaign.id, campaign.active)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  campaign.active
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30'
                    : 'bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30'
                }`}
              >
                {campaign.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg">
          <Tag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">No campaigns yet</p>
        </div>
      )}

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
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
    product_ids: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    });
  };

  const toggleProduct = (productId: string) => {
    setFormData({
      ...formData,
      product_ids: formData.product_ids.includes(productId)
        ? formData.product_ids.filter((id) => id !== productId)
        : [...formData.product_ids, productId],
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Create Sales Campaign</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Select Products ({formData.product_ids.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-800 rounded-lg p-4 space-y-2">
              {products.map((product) => (
                <label
                  key={product.id}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.product_ids.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-400">${product.price}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-500 hover:to-red-400 transition-all"
            >
              Create Campaign
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
