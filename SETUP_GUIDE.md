# Complete Setup Guide

This guide will help you set up your e-commerce platform with Supabase database and Stripe payments.

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- (Optional) A Stripe account for payments

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### 3.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and create

#### 3.2 Get API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy:
   - **Project URL**
   - **anon/public key**

#### 3.3 Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Execute these migration files in order:

**First Migration - Core Tables:**
```sql
-- Copy content from: supabase/migrations/create_complete_ecommerce_system.sql
```

**Second Migration - Stripe Integration:**
```sql
-- Copy content from: supabase/migrations/add_stripe_integration_columns.sql
```

### 4. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your values:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 5. Run Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`

## Database Setup Details

### Default Products

The migration includes 6 default products:
- Premium Netflix Account
- Spotify Premium Family
- VPN Premium Service
- Cloud Storage Pro
- YouTube Premium
- Office 365 Business

### Creating Admin User

1. Sign up through the website at `/auth`
2. Get your user UUID from Supabase **Authentication** > **Users**
3. In **SQL Editor**, run:
   ```sql
   INSERT INTO admin_users (id, email, role)
   VALUES ('your-user-uuid', 'admin@yourdomain.com', 'super_admin');
   ```
4. Access admin panel at `/admin/login`

## Stripe Integration (Optional)

### 1. Get Stripe Keys

1. Create account at [https://stripe.com](https://stripe.com)
2. Go to **Developers** > **API keys**
3. Copy your keys (use test keys for development)

### 2. Add Keys to .env

```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### 3. Sync Products to Stripe

After adding products in admin panel, sync them:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/stripe-handler/sync-products \
  -H "Authorization: Bearer your_supabase_anon_key"
```

### 4. Setup Webhooks

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-handler/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   ```

## Features

### Customer Features
- ✅ Browse products with real-time pricing
- ✅ Shopping cart functionality
- ✅ User authentication (email/password)
- ✅ Order history and tracking
- ✅ Product reviews and ratings
- ✅ Wishlist functionality
- ✅ Secure checkout with Stripe
- ✅ License key delivery
- ✅ User notifications
- ✅ Profile management

### Admin Features
- ✅ Product management (CRUD)
- ✅ Sales campaigns with discounts
- ✅ Order management
- ✅ Customer management
- ✅ Analytics dashboard
- ✅ Invoice generation
- ✅ Notification system
- ✅ Activity logging

## Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build:** Vite

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Edge Functions:** Supabase Edge Functions

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Authenticated user policies
- ✅ Admin-only access controls
- ✅ Secure API key management
- ✅ HTTPS enforcement in production

## Database Schema

### Core Tables
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Order line items
- `licenses` - License keys
- `reviews` - Product reviews
- `sales_campaigns` - Discount campaigns
- `user_profiles` - Extended user info
- `wishlists` - User wishlists
- `notifications` - User notifications
- `admin_users` - Admin access control

### Key Features
- Automatic timestamps (created_at, updated_at)
- Foreign key constraints
- Check constraints for data validation
- Indexes for performance
- Triggers for auto-calculations

## API Endpoints

### Stripe Edge Function

**Base URL:** `https://your-project.supabase.co/functions/v1/stripe-handler`

#### Create Checkout Session
```
POST /create-checkout
Body: { productId, userId }
Response: { url, sessionId }
```

#### Webhook Handler
```
POST /webhook
Headers: stripe-signature
Body: Stripe event payload
```

#### Sync Products to Stripe
```
POST /sync-products
Response: { synced, products }
```

## Development

### Available Scripts

```bash
npm run dev         # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript compiler
```

### Project Structure

```
src/
├── components/        # React components
│   └── admin/        # Admin-specific components
├── contexts/         # React contexts (auth, etc.)
├── lib/             # Utility libraries
├── pages/           # Page components
│   └── admin/       # Admin pages
├── services/        # API service layer
└── utils/           # Helper functions

supabase/
└── migrations/      # Database migrations
```

## Testing

### Manual Testing Checklist

- [ ] User signup/login works
- [ ] Products display correctly
- [ ] Add to cart functions
- [ ] Checkout redirects to Stripe
- [ ] Payment completes successfully
- [ ] License key is generated
- [ ] Admin login works
- [ ] Product CRUD works in admin
- [ ] Sales campaigns apply correctly
- [ ] Notifications are delivered

## Troubleshooting

### Build Issues

**Issue:** Module not found errors
**Solution:** Run `npm install` again

**Issue:** TypeScript errors
**Solution:** Run `npm run typecheck` to see details

### Database Issues

**Issue:** RLS policies blocking access
**Solution:** Check user is authenticated and has correct role

**Issue:** Migrations fail
**Solution:** Ensure migrations run in order, check for existing data

### Stripe Issues

**Issue:** Payments not processing
**Solution:** Verify Stripe keys are correct (test vs live)

**Issue:** Webhooks not received
**Solution:** Check webhook URL and secret are correct

## Production Deployment

See [PTERODACTYL_DEPLOYMENT.md](./PTERODACTYL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Checklist

- [ ] Set up Supabase project
- [ ] Run all migrations
- [ ] Configure environment variables
- [ ] Create admin user
- [ ] Add products
- [ ] Sync products to Stripe
- [ ] Configure webhooks
- [ ] Build application
- [ ] Deploy to hosting
- [ ] Test checkout flow
- [ ] Enable SSL certificate

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev

## License

Private - All Rights Reserved

---

**Need Help?** Check the troubleshooting section or review the detailed deployment guide.
