import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stripe_product_id?: string;
  stripe_price_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (path.endsWith('/create-checkout')) {
      const { productId, userId } = await req.json();

      if (!productId || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing productId or userId' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        return new Response(
          JSON.stringify({ error: 'Product not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      if (!stripeKey) {
        return new Response(
          JSON.stringify({ error: 'Stripe not configured' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const checkoutSessionData: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${url.origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url.origin}/checkout?canceled=true`,
        metadata: {
          product_id: productId,
          user_id: userId,
        },
      };

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(checkoutSessionData as any).toString(),
      });

      const session = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: session.error?.message || 'Failed to create checkout session' }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await supabase.from('orders').insert({
        user_id: userId,
        total: product.price,
        status: 'pending',
        stripe_session_id: session.id,
        shipping_address: {},
      });

      return new Response(
        JSON.stringify({ url: session.url, sessionId: session.id }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (path.endsWith('/webhook')) {
      const signature = req.headers.get('stripe-signature');
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

      if (!signature || !webhookSecret) {
        return new Response(
          JSON.stringify({ error: 'Missing signature or webhook secret' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const body = await req.text();

      let event;
      try {
        event = JSON.parse(body);
      } catch (err) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const productId = session.metadata?.product_id;

        if (userId && productId) {
          await supabase
            .from('orders')
            .update({
              status: 'completed',
              stripe_payment_intent_id: session.payment_intent,
            })
            .eq('stripe_session_id', session.id);

          const licenseKey = generateLicenseKey();
          const { data: order } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_session_id', session.id)
            .single();

          if (order) {
            await supabase.from('licenses').insert({
              user_id: userId,
              product_id: productId,
              order_id: order.id,
              license_key: licenseKey,
              status: 'active',
            });

            await supabase.from('notifications').insert({
              user_id: userId,
              type: 'success',
              title: 'Order Completed',
              message: 'Your order has been completed successfully!',
              read: false,
            });
          }
        }
      }

      return new Response(
        JSON.stringify({ received: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (path.endsWith('/sync-products')) {
      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      if (!stripeKey) {
        return new Response(
          JSON.stringify({ error: 'Stripe not configured' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: products } = await supabase
        .from('products')
        .select('*');

      const syncedProducts = [];

      for (const product of products || []) {
        if (!product.stripe_product_id) {
          const stripeProduct = await fetch('https://api.stripe.com/v1/products', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${stripeKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              name: product.name,
              description: product.description,
            }).toString(),
          }).then(res => res.json());

          const stripePrice = await fetch('https://api.stripe.com/v1/prices', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${stripeKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              product: stripeProduct.id,
              unit_amount: String(Math.round(product.price * 100)),
              currency: 'usd',
            }).toString(),
          }).then(res => res.json());

          await supabase
            .from('products')
            .update({
              stripe_product_id: stripeProduct.id,
              stripe_price_id: stripePrice.id,
            })
            .eq('id', product.id);

          syncedProducts.push(product.id);
        }
      }

      return new Response(
        JSON.stringify({ synced: syncedProducts.length, products: syncedProducts }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 4;
  const segmentLength = 4;
  const parts = [];

  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(segment);
  }

  return parts.join('-');
}
