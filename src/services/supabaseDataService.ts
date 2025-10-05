import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating?: number;
  features: string[];
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address: any;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface SalesCampaign {
  id: string;
  name: string;
  description?: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  active: boolean;
  product_ids: string[]; // array of product UUIDs
  created_at: string;
}

export interface ProductWithSale extends Product {
  original_price?: number;
  sale_discount?: number;
  on_sale?: boolean;
}

export interface License {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  license_key: string;
  status: string;
  created_at: string;
}

class SupabaseDataService {
  // 🛍️ PRODUCTS
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data || [];
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  }

  // 💸 SALES CAMPAIGNS
  async getActiveSales(): Promise<SalesCampaign[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('sales_campaigns')
      .select('*')
      .eq('active', true)
      .lte('start_date', now)
      .gte('end_date', now);

    if (error) {
      console.error('Error fetching active sales:', error);
      return [];
    }

    return data || [];
  }

  async getProductsWithSales(): Promise<ProductWithSale[]> {
    const products = await this.getProducts();
    const activeSales = await this.getActiveSales();

    return products.map(product => {
      // ✅ Safe lookup — prevent "includes" crash
      const sale = activeSales.find(
        s => Array.isArray(s.product_ids) && s.product_ids.includes(product.id)
      );

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

  async getProductWithSale(id: string): Promise<ProductWithSale | null> {
    const product = await this.getProduct(id);
    if (!product) return null;

    const activeSales = await this.getActiveSales();
    const sale = activeSales.find(
      s => Array.isArray(s.product_ids) && s.product_ids.includes(product.id)
    );

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
  }

  // 🧾 ORDERS
  async getOrders(userId?: string): Promise<Order[]> {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return null;
    }

    return data;
  }

  // 🪪 LICENSES
  async getUserLicenses(userId: string): Promise<License[]> {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching licenses:', error);
      return [];
    }

    return data || [];
  }

  // 📢 SALES CAMPAIGN MANAGEMENT
  async createSalesCampaign(campaign: Omit<SalesCampaign, 'id' | 'created_at'>): Promise<SalesCampaign | null> {
    const { data, error } = await supabase
      .from('sales_campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      console.error('Error creating sales campaign:', error);
      return null;
    }

    return data;
  }

  async updateSalesCampaign(id: string, updates: Partial<SalesCampaign>): Promise<SalesCampaign | null> {
    const { data, error } = await supabase
      .from('sales_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating sales campaign:', error);
      return null;
    }

    return data;
  }

  async deleteSalesCampaign(id: string): Promise<boolean> {
    const { error } = await supabase.from('sales_campaigns').delete().eq('id', id);

    if (error) {
      console.error('Error deleting sales campaign:', error);
      return false;
    }

    return true;
  }

  async getSalesCampaigns(): Promise<SalesCampaign[]> {
    const { data, error } = await supabase
      .from('sales_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales campaigns:', error);
      return [];
    }

    return data || [];
  }

  // 💖 WISHLISTS
  async addToWishlist(userId: string, productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('wishlists')
      .insert([{ user_id: userId, product_id: productId }]);

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  }

  async getWishlist(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id, products(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    return data?.map((item: any) => item.products).filter(Boolean) || [];
  }

  // 🔔 NOTIFICATIONS
  async createNotification(userId: string, title: string, message: string, type: string = 'info'): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, title, message, type }]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  }

  async getNotifications(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }
}

export const supabaseDataService = new SupabaseDataService();
