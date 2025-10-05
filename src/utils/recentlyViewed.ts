import { supabase } from '../lib/supabase';

export async function trackProductView(productId: string, userId: string | undefined) {
  if (!userId) return;

  try {
    const { error } = await supabase
      .from('recently_viewed')
      .upsert(
        {
          user_id: userId,
          product_id: productId,
          viewed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,product_id' }
      );

    if (error) throw error;

    await supabase.rpc('increment', {
      row_id: productId,
      table_name: 'products',
      column_name: 'views_count'
    }).catch(() => {
      // Fallback if RPC doesn't exist
      supabase
        .from('products')
        .update({ views_count: supabase.raw('views_count + 1') })
        .eq('id', productId);
    });
  } catch (error) {
    console.error('Error tracking product view:', error);
  }
}

export async function getRecentlyViewedProducts(userId: string | undefined, limit = 6) {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('recently_viewed')
      .select(`
        product_id,
        viewed_at,
        products (*)
      `)
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data?.map(item => ({
      ...item.products,
      viewedAt: item.viewed_at
    })) || [];
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    return [];
  }
}
