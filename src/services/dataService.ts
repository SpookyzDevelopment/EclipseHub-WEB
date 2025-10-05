export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
  features: string[];
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  product_id: string;
  product_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
}

export interface SalesCampaign {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  active: boolean;
  product_ids: string[];
}

export interface ProductWithSale extends Product {
  original_price?: number;
  sale_discount?: number;
  on_sale?: boolean;
}

const STORAGE_KEYS = {
  PRODUCTS: 'alxne_products',
  ORDERS: 'alxne_orders',
  CUSTOMERS: 'alxne_customers',
  INITIALIZED: 'alxne_initialized'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Netflix Account',
    description: 'Full HD streaming with 4 screens. Lifetime warranty included.',
    price: 29.99,
    category: 'Accounts',
    image_url: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_featured: true,
    stock_status: 'in_stock',
    rating: 4.8,
    features: ['4K Ultra HD', '4 Screens', 'Lifetime Warranty', 'Instant Delivery'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Spotify Premium Family',
    description: 'Ad-free music streaming for up to 6 accounts.',
    price: 19.99,
    category: 'Accounts',
    image_url: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_featured: true,
    stock_status: 'in_stock',
    rating: 4.9,
    features: ['6 Accounts', 'Ad-Free', 'Offline Mode', '30-Day Warranty'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'VPN Premium Service',
    description: 'Secure browsing with unlimited bandwidth across all devices.',
    price: 39.99,
    category: 'Security',
    image_url: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_featured: true,
    stock_status: 'in_stock',
    rating: 4.7,
    features: ['Unlimited Bandwidth', 'Multiple Devices', 'No Logs Policy', '24/7 Support'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cloud Storage Pro',
    description: '2TB secure cloud storage with automatic backup.',
    price: 49.99,
    category: 'Developer Tools',
    image_url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_featured: true,
    stock_status: 'in_stock',
    rating: 4.6,
    features: ['2TB Storage', 'Auto Backup', 'End-to-End Encryption', 'File Sharing'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'YouTube Premium',
    description: 'Ad-free videos, background play, and YouTube Music included.',
    price: 14.99,
    category: 'Accounts',
    image_url: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_featured: false,
    stock_status: 'in_stock',
    rating: 4.5,
    features: ['No Ads', 'Background Play', 'YouTube Music', 'Offline Downloads'],
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Office 365 Business',
    description: 'Complete Microsoft Office suite for teams.',
    price: 99.99,
    category: 'Team Tools',
    image_url: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=800',
    is_featured: false,
    stock_status: 'in_stock',
    rating: 4.8,
    features: ['All Office Apps', '5 Users', '1TB Storage Each', 'Teams Integration'],
    created_at: new Date().toISOString()
  }
];

class DataService {
  private initializeData() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

    if (!isInitialized) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  constructor() {
    this.initializeData();
  }

  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
  }

  getProduct(id: string): Product | null {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  getFeaturedProducts(): Product[] {
    return this.getProducts().filter(p => p.is_featured);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    console.log('✅ Product created:', newProduct.name, '- Dispatching update event');
    window.dispatchEvent(new Event('products-updated'));
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    console.log('✅ Product updated:', products[index].name, '- Dispatching update event');
    window.dispatchEvent(new Event('products-updated'));
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const productToDelete = products.find(p => p.id === id);
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) return false;

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    console.log('✅ Product deleted:', productToDelete?.name, '- Dispatching update event');
    window.dispatchEvent(new Event('products-updated'));
    return true;
  }

  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  createOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    this.updateCustomerStats(order.user_email, order.amount);

    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);

    if (index === -1) return null;

    orders[index] = { ...orders[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  }

  getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  private updateCustomerStats(email: string, amount: number) {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.email === email);

    if (index === -1) {
      customers.push({
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
        total_orders: 1,
        total_spent: amount
      });
    } else {
      customers[index].total_orders += 1;
      customers[index].total_spent += amount;
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  getActiveSales(): SalesCampaign[] {
    const data = localStorage.getItem('sales_campaigns');
    const campaigns: SalesCampaign[] = data ? JSON.parse(data) : [];
    const now = new Date();

    return campaigns.filter(campaign => {
      if (!campaign.active) return false;
      const startDate = new Date(campaign.start_date);
      const endDate = new Date(campaign.end_date);
      return now >= startDate && now <= endDate;
    });
  }

  getProductsWithSales(): ProductWithSale[] {
    const products = this.getProducts();
    const activeSales = this.getActiveSales();

    return products.map(product => {
      // Find if product is in any active sale
      const sale = activeSales.find(s => s.product_ids.includes(product.id));

      if (sale) {
        const discountedPrice = product.price * (1 - sale.discount_percentage / 100);
        return {
          ...product,
          original_price: product.price,
          price: discountedPrice,
          sale_discount: sale.discount_percentage,
          on_sale: true
        };
      }

      return product;
    });
  }

  getProductWithSale(id: string): ProductWithSale | null {
    const products = this.getProductsWithSales();
    return products.find(p => p.id === id) || null;
  }

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.removeItem('sales_campaigns');
    this.initializeData();
  }

  exportData() {
    return {
      products: this.getProducts(),
      orders: this.getOrders(),
      customers: this.getCustomers()
    };
  }

  importData(data: { products?: Product[], orders?: Order[], customers?: Customer[] }) {
    if (data.products) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
    }
    if (data.orders) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
    }
    if (data.customers) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(data.customers));
    }
  }
}

export const dataService = new DataService();
