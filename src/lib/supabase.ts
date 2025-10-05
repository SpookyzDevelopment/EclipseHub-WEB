import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const FALLBACK_MESSAGE =
  'Supabase environment variables are not configured. The app is running in demo mode with limited functionality.';

type SupabaseClient = ReturnType<typeof createClient>;

function createMockQueryResult<T>(data: T | null = null) {
  return {
    data,
    error: new Error(FALLBACK_MESSAGE),
  };
}

function createMockQueryBuilder() {
  const result = createMockQueryResult();
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    order: () => builder,
    eq: () => builder,
    lte: () => builder,
    gte: () => builder,
    limit: () => builder,
    single: async () => result,
    maybeSingle: async () => result,
    then: (onFulfilled: any, onRejected: any) =>
      Promise.resolve(result).then(onFulfilled, onRejected),
    catch: (onRejected: any) => Promise.resolve(result).catch(onRejected),
    finally: (onFinally: any) => Promise.resolve(result).finally(onFinally),
  };

  return builder;
}

function createMockSupabaseClient(): SupabaseClient {
  if (typeof console !== 'undefined') {
    console.warn(FALLBACK_MESSAGE);
  }

  const result = createMockQueryResult();

  return {
    from: () => createMockQueryBuilder(),
    rpc: async () => result,
    raw: (value: string) => value,
    auth: {
      admin: {
        listUsers: async () => result,
      },
      resetPasswordForEmail: async () => result,
    },
  } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  features: string[];
  created_at: string;
  updated_at: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  discount_percentage?: number;
  original_price?: number;
  average_rating?: number;
  review_count?: number;
  views_count?: number;
}
