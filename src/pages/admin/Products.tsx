import { useState, useEffect } from 'react';
import { Package, Plus, CreditCard as Edit, Trash2, Search, Save } from 'lucide-react';
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
      setProducts(data || []); // ✅ handle null
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

  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) // ✅ safe name
  );

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
              <Package className="w-8 h-8 text-green-400" />
              <h1 className="text-4xl font-bold">Products</h1>
            </div>
            <p className="text-gray-400">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-400 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const status = product.stock_status || 'unknown'; // ✅ fallback
          const displayStatus = status.replace('_', ' '); // ✅ safe
          return (
            <div
              key={product.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all"
            >
              <div className="relative h-48 bg-gray-800">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name || 'Unnamed'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Package className="w-10 h-10" />
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'in_stock'
                        ? 'bg-green-500/20 text-green-400'
                        : status === 'low_stock'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {displayStatus}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{product.name || 'Untitled Product'}</h3>
                <p className="text-sm text-gray-400 mb-2">{product.category || 'Uncategorized'}</p>
                <p className="text-2xl font-bold text-green-400 mb-4">
                  ${product.price?.toFixed(2) ?? '0.00'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">No products found</p>
        </div>
      )}

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

// Product Modal unchanged — it’s already robust
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
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    image_url: product?.image_url || '',
    stock_status: product?.stock_status || 'in_stock',
    is_featured: product?.is_featured || false,
    rating: product?.rating || 4.5,
    features: product?.features || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Create Product'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inputs identical to your current version */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
}
