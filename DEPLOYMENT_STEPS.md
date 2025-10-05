# Deployment Steps - Quick Reference

## For Pterodactyl Panel Deployment

### Step 1: Upload Files
Upload all project files to your Pterodactyl server or clone via Git.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Setup Supabase Database
1. Go to https://supabase.com and create a project
2. In SQL Editor, run these migrations IN ORDER:

**Migration 1:**
- Open `supabase/migrations/create_complete_ecommerce_system.sql`
- Copy and paste into SQL Editor
- Click "Run"

**Migration 2:**
- Open `supabase/migrations/add_stripe_integration_columns.sql`
- Copy and paste into SQL Editor
- Click "Run"

### Step 5: Build Application
```bash
npm run build
```

This creates the `dist/` folder with your production-ready app.

### Step 6: Start Server
```bash
npm start
```

Or set Pterodactyl startup command to:
```bash
node server.js
```

### Step 7: Create Admin User
1. Visit your website and sign up
2. Go to Supabase dashboard > Authentication > Users
3. Copy your User ID (UUID)
4. In SQL Editor, run:
```sql
INSERT INTO admin_users (id, email, role)
VALUES ('your-user-uuid-here', 'admin@yourdomain.com', 'super_admin');
```

### Step 8: Access Admin Panel
Visit: `http://your-domain.com/admin/login`

## Server Configuration

### Your `server.js` does 3 things:
1. **Serves static files** from `dist/` folder (your built React app)
2. **Handles all routes** by sending `index.html` (allows React Router to work)
3. **Listens on port** from environment variable or defaults to 3000

### Key Points:
- ✅ Uses ES modules (`import`/`export`)
- ✅ Serves from `dist/` (not `public/`)
- ✅ SPA fallback for React Router
- ✅ Works with Pterodactyl port allocation

## Pterodactyl Startup Settings

### Startup Command:
```bash
npm start
```

Or directly:
```bash
node server.js
```

### Environment Variables (in Pterodactyl):
- `SERVER_PORT` - Automatically set by Pterodactyl
- `NODE_ENV` - Set to `production`

## How It Works

```
User Request → Express Server → dist/index.html → React App → React Router
                    ↓
             Supabase Database
                    ↓
             Stripe Payments
```

1. **User visits any URL** (e.g., `/products`, `/admin`, etc.)
2. **Express server** serves `dist/index.html`
3. **React loads** and takes over routing
4. **React Router** shows the correct page
5. **Components fetch data** from Supabase
6. **Payments go through** Stripe Edge Functions

## Verify Installation

### 1. Check if server starts:
```bash
npm start
```
You should see:
```
🚀 ALXNE E-Commerce Server running at http://0.0.0.0:3000
📦 Environment: production
✅ Ready to accept connections
```

### 2. Test health endpoint:
```bash
curl http://localhost:3000/health
```
Should return:
```json
{"status":"ok","timestamp":"2025-10-04T..."}
```

### 3. Visit website:
Open browser to `http://your-ip:3000`

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install`

### Issue: "Cannot find dist/index.html"
**Solution:** Run `npm run build` first

### Issue: "Port already in use"
**Solution:**
- Change port: `PORT=3001 npm start`
- Or kill process: `pkill -f node`

### Issue: "Database connection failed"
**Solution:**
- Check `.env` has correct Supabase credentials
- Verify Supabase project is active
- Check migrations were run

### Issue: "Admin login not working"
**Solution:**
- Verify admin user was created in database
- Check SQL query was successful
- Try logging out and back in

## Production Checklist

Before launching:
- [ ] `npm install` completed successfully
- [ ] `npm run build` completed successfully
- [ ] `.env` file configured with Supabase
- [ ] Database migrations run in Supabase
- [ ] Admin user created
- [ ] Server starts with `npm start`
- [ ] Can access website in browser
- [ ] Can login to admin panel
- [ ] Can create/edit products
- [ ] (Optional) Stripe keys configured

## Quick Deploy Script

Run this for automated deployment:
```bash
chmod +x deploy.sh
./deploy.sh
```

Then start the server:
```bash
npm start
```

## Need Help?

1. Check server logs in Pterodactyl console
2. Check browser console (F12) for frontend errors
3. Check Supabase logs for database errors
4. Review `PTERODACTYL_DEPLOYMENT.md` for detailed guide

---

**Your server is now configured correctly and ready to run!**
