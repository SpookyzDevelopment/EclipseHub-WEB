import { useEffect, useMemo, useState } from 'react';
import { Package, Plus, CreditCard as Edit, Trash2, Search, Save, Sparkles, Tag } from 'lucide-react';
import { supabaseDataService, Product } from '../../services/supabaseDataService';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await supabaseDataService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? It will be removed from the website immediately.')) return;
    try {
      const success = await supabaseDataService.deleteProduct(id);
      if (success) {
        setProducts((p) => p.filter((x) => x.id !== id));
        alert('✅ Product deleted successfully!');
      } else alert('Failed to delete product');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  const handleSave = async (product: Partial<Product>) => {
    try {
      if (editingProduct) {
        await supabaseDataService.updateProduct(editingProduct.id, product);
        alert('✅ Product updated successfully!');
      } else {
        await supabaseDataService.createProduct(product as Omit<Product, 'id' | 'created_at'>);
        alert('✅ Product created successfully!');
      }
      fetchProducts();
      setEditingProduct(null);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())),
    [products, searchQuery]
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
                <Package className="h-4 w-4" />
                Product vault
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Design neon experiences</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Curate immersive merch, manage availability, and orchestrate drops that electrify eclipcestore.digital.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-100 transition-all hover:border-purple-300 hover:bg-purple-500/20"
              >
                <Plus className="h-4 w-4" />
                New product
              </button>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/60">
                <Sparkles className="h-4 w-4 text-purple-200" />
                {products.length} items live
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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-12 py-3 text-sm text-white focus:border-purple-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const status = product.stock_status || 'unknown';
              const displayStatus = status.replace('_', ' ');
              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-black/30 transition-transform duration-300 hover:-translate-y-1 hover:border-purple-400/40"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name || 'Unnamed'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
                        <Package className="h-10 w-10" />
                      </div>
                    )}

                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                        status === 'in_stock'
                          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                          : status === 'low_stock'
                          ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                          : 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      {displayStatus}
                    </span>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{product.name || 'Untitled product'}</h3>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{product.category || 'Uncategorized'}</p>
                    </div>
                    <p className="text-3xl font-semibold text-emerald-300">
                      ${product.price?.toFixed(2) ?? '0.00'}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-purple-400/40 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 transition-all hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-10 flex flex-col items-center gap-2 text-white/60">
              <Package className="h-12 w-12 text-white/30" />
              <p>No products found</p>
            </div>
          )}
        </section>
      </div>

      {(editingProduct || showCreateModal) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setShowCreateModal(false);
          }}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    category: product?.category || '',
    image_url: product?.image_url || '',
    stock_status: product?.stock_status || 'in_stock',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<Product> = {
      ...product,
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      image_url: formData.image_url,
      stock_status: formData.stock_status,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 py-10 backdrop-blur" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#06001b] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold">
            {product ? 'Edit product' : 'Create product'}
          </h3>
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
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Name</label>
              <input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Category</label>
              <input
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Image URL</label>
              <input
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Stock status</label>
              <select
                value={formData.stock_status}
                onChange={(e) => handleChange('stock_status', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
              >
                <option value="in_stock">In stock</option>
                <option value="low_stock">Low stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]"
            >
              <Save className="h-4 w-4" />
              {product ? 'Save changes' : 'Create product'}
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
