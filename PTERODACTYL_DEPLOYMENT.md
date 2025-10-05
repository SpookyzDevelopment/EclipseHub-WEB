# Pterodactyl Panel Deployment Guide

This guide will walk you through deploying your e-commerce application on Pterodactyl Panel.

## Prerequisites

- Access to a Pterodactyl Panel
- A Supabase account (free tier available at https://supabase.com)
- Node.js egg installed on your Pterodactyl Panel
- (Optional) A Stripe account for payment processing

## Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: Choose a name for your project
   - Database Password: Create a strong password
   - Region: Select closest to your users
4. Click "Create new project" and wait for it to initialize

### 1.2 Get API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 1.3 Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the migration files from `supabase/migrations/` folder in order:
   - `create_complete_ecommerce_system.sql`
   - `add_stripe_integration_columns.sql`
3. Copy and paste each migration SQL into the SQL Editor
4. Click "Run" for each migration

## Step 2: Setup Pterodactyl Server

### 2.1 Create Server

1. In Pterodactyl Panel, create a new server
2. Select the **Node.js** egg
3. Allocate resources:
   - Memory: At least 1GB recommended
   - Disk: At least 2GB recommended
   - CPU: At least 100%

### 2.2 Upload Files

1. Access your server's File Manager
2. Upload all project files or use Git to clone:
   ```bash
   git clone <your-repo-url> .
   ```

## Step 3: Configure Environment Variables

### 3.1 Create .env File

1. In the File Manager, create a new file named `.env`
2. Copy contents from `.env.example` and fill in your values:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration (OPTIONAL - only if using payments)
STRIPE_SECRET_KEY=sk_test_or_sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
VITE_APP_URL=http://your-domain.com
NODE_ENV=production
```

### 3.2 Important Notes

- **NEVER** commit your `.env` file to version control
- Keep your Supabase and Stripe keys secure
- Use test keys for development, live keys for production

## Step 4: Install Dependencies

1. Open the server Console
2. Run the installation command:
   ```bash
   npm install
   ```
3. Wait for all dependencies to install

## Step 5: Build the Application

1. In the Console, run the build command:
   ```bash
   npm run build
   ```
2. This will create an optimized production build in the `dist/` folder

## Step 6: Configure Startup

### 6.1 Set Startup Command

1. Go to **Startup** tab in Pterodactyl
2. Set the startup command to:
   ```bash
   npm run preview
   ```
   Or if you want to use a custom port:
   ```bash
   npm run preview -- --port {{SERVER_PORT}}
   ```

### 6.2 Configure Port

1. In the **Startup** tab, set the port variable to match your allocated port
2. The application will be accessible at: `http://your-server-ip:port`

## Step 7: Setup Admin Access

### 7.1 Create Admin User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click "Add User"
3. Create a user with email/password
4. Copy the User ID (UUID)

### 7.2 Grant Admin Role

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with your user ID):
   ```sql
   INSERT INTO admin_users (id, email, role)
   VALUES ('your-user-uuid', 'admin@yourdomain.com', 'super_admin');
   ```

### 7.3 Access Admin Panel

1. Go to your website
2. Login with your admin credentials
3. Navigate to `/admin/login`
4. Start managing products, sales, and orders!

## Step 8: Setup Stripe (Optional)

If you want to accept payments, follow these steps:

### 8.1 Create Stripe Account

1. Go to https://stripe.com and sign up
2. Complete business verification
3. Get your API keys from the Dashboard

### 8.2 Configure Stripe Edge Function

Your Stripe Edge Function is already deployed. To use it:

1. Add your Stripe keys to `.env` file
2. The checkout will automatically use Stripe

### 8.3 Setup Stripe Webhooks

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click "Add endpoint"
3. Enter URL: `https://your-supabase-project.supabase.co/functions/v1/stripe-handler/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the webhook signing secret
6. Add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

### 8.4 Sync Products to Stripe

After adding products in the admin panel, sync them to Stripe:

1. Send a POST request to: `https://your-supabase-project.supabase.co/functions/v1/stripe-handler/sync-products`
2. This will create Stripe products and prices for all your products

## Step 9: Domain Setup (Optional)

### 9.1 Configure Reverse Proxy

If using a domain, set up a reverse proxy (nginx/Apache):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:YOUR_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9.2 Setup SSL Certificate

Use Certbot to get a free SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Step 10: Monitoring & Maintenance

### 10.1 Check Logs

- View logs in Pterodactyl Console
- Check Supabase logs in **Database** > **Logs**
- Monitor Stripe webhooks in Stripe Dashboard

### 10.2 Database Backups

Supabase automatically backs up your database. To download:
1. Go to **Database** > **Backups** in Supabase
2. Click "Download" on any backup

### 10.3 Updates

To update your application:
1. Pull latest changes: `git pull`
2. Install dependencies: `npm install`
3. Rebuild: `npm run build`
4. Restart server in Pterodactyl

## Troubleshooting

### Common Issues

**Server won't start:**
- Check Console for errors
- Verify `.env` file exists and has correct values
- Ensure `npm install` completed successfully

**Database connection issues:**
- Verify Supabase URL and keys are correct
- Check if Supabase project is active
- Ensure migrations were run

**Payments not working:**
- Verify Stripe keys are correct (test vs live)
- Check Stripe webhook configuration
- Review Stripe logs in Dashboard

**Products not showing:**
- Verify migrations were run
- Check if products exist in Supabase database
- Review browser console for errors

### Getting Help

If you encounter issues:
1. Check server logs in Pterodactyl Console
2. Review browser console (F12) for frontend errors
3. Check Supabase logs for database errors
4. Verify all environment variables are set correctly

## Security Best Practices

1. **Never commit sensitive keys** to version control
2. **Use strong passwords** for admin accounts
3. **Keep dependencies updated** regularly
4. **Enable Supabase RLS** (already configured)
5. **Use HTTPS** in production
6. **Monitor access logs** regularly
7. **Backup database** regularly

## Performance Optimization

1. **Enable caching** in your reverse proxy
2. **Use CDN** for static assets
3. **Monitor resource usage** in Pterodactyl
4. **Optimize images** before uploading
5. **Enable gzip compression** in nginx

## Production Checklist

Before going live, ensure:

- [ ] All migrations are run
- [ ] Environment variables are set correctly
- [ ] Admin account is created
- [ ] Products are added and synced to Stripe
- [ ] SSL certificate is installed
- [ ] Domain is configured
- [ ] Stripe webhooks are setup
- [ ] Database backups are enabled
- [ ] Error monitoring is configured
- [ ] Test checkout flow works
- [ ] Test admin panel access
- [ ] Review security settings

## Support

For issues specific to:
- **Pterodactyl**: Check Pterodactyl documentation
- **Supabase**: Visit https://supabase.com/docs
- **Stripe**: Visit https://stripe.com/docs

---

**Congratulations!** Your e-commerce platform is now deployed and ready to accept orders!
