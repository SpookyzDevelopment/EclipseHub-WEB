# Production Deployment Guide

This is a complete, production-ready e-commerce platform with Supabase database integration.

## Features

✅ **User Management**
- Email/password authentication with Supabase Auth
- User profiles automatically created on signup
- Real-time user data syncing

✅ **Admin Panel**
- Secure admin authentication
- View all registered users in Customers page
- Send notifications to users (single or bulk)
- Manage products, sales campaigns, and orders
- Real-time analytics dashboard

✅ **Notifications System**
- Admin can send notifications to any user
- Users see notifications in real-time
- Notification bell with unread count
- Mark as read functionality

✅ **E-commerce Features**
- Product catalog with search and filters
- Sales campaigns with automatic pricing
- Wishlist with localStorage
- Shopping cart
- Modern 2025-level animations

✅ **Database**
- Supabase (PostgreSQL) - Free, self-hostable
- All data persisted in database
- Row Level Security (RLS) enabled
- Automatic user profile creation

## Quick Deployment

### Option 1: Netlify (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Netlify:**
   - Go to https://netlify.com
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Build settings are auto-detected:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables (from your `.env` file):
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

### Option 2: Vercel

1. **Push to GitHub** (same as above)

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

### Option 3: Self-Hosted (VPS/Cloud)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Serve the `dist` folder** with any static server:
   ```bash
   # Using Python
   cd dist && python3 -m http.server 8080

   # Using Node.js
   npx serve dist

   # Using Nginx (production)
   # Copy dist/* to /var/www/html/
   ```

3. **Nginx Configuration Example:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Environment Variables

Your `.env` file already contains the Supabase credentials. Make sure to add these to your deployment platform:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup (Already Done!)

The database is already configured with:
- ✅ Products table
- ✅ Orders table
- ✅ User profiles table
- ✅ Notifications table
- ✅ Sales campaigns table
- ✅ Admin users table
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers for user creation

## Admin Access

**Default Admin Credentials:**
- Email: `admin@alxne.com`
- Password: `Admin123!@#`

**Admin Panel URL:** `https://yourdomain.com/admin/login`

## Testing the System

### 1. User Registration
1. Go to your deployed site
2. Click "Get Started" or "Sign Up"
3. Register with any email/password
4. User profile is automatically created in database

### 2. Admin Notifications
1. Login to admin panel
2. Go to "Customers" page
3. You'll see all registered users
4. Select user(s) and click "Send Notification"
5. Fill in notification details and send
6. Users will see notifications in their bell icon

### 3. Sales Campaigns
1. In admin panel, go to "Sales & Discounts"
2. Create a campaign with products
3. Activate the campaign
4. Products will show sale prices on main site immediately

## File Structure

```
/
├── dist/                 # Production build (deploy this)
├── src/                  # Source code
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── contexts/         # Auth contexts
│   ├── lib/              # Supabase client
│   └── services/         # Data services
├── supabase/
│   └── migrations/       # Database migrations (already applied)
├── .env                  # Environment variables
└── vite.config.ts        # Build configuration
```

## Supabase Dashboard

Access your Supabase dashboard at:
https://supabase.com/dashboard

From there you can:
- View all database tables
- Monitor user authentication
- Check RLS policies
- View logs and analytics
- Backup database

## Production Checklist

✅ Database migrations applied
✅ RLS policies enabled
✅ Authentication configured
✅ Admin system working
✅ Notifications system functional
✅ Sales campaigns working
✅ Wishlist working
✅ Modern animations added
✅ Production build created
✅ Environment variables documented

## Support

For issues or questions:
1. Check Supabase dashboard for database issues
2. Check browser console for client-side errors
3. Check network tab for API errors
4. Verify environment variables are set correctly

## Notes

- The app uses Supabase for database (free tier available)
- Supabase can be self-hosted if needed
- All features work out of the box
- No additional configuration needed
- Ready for production deployment

---

🎉 **Your e-commerce platform is 100% ready to deploy!**
