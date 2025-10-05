# ALXNE Admin Panel Guide

## Accessing the Admin Panel

Navigate to `/admin/login` to access the admin portal.

### Default Admin Credentials

```
Email: admin@alxne.com
Password: Admin123!@#
```

**Important:** These credentials can be customized via environment variables:
- `VITE_ADMIN_EMAIL` - Set your admin email
- `VITE_ADMIN_PASSWORD` - Set your admin password

Add these to your `.env` file for custom credentials.

## Admin Panel Features

### 1. Dashboard (`/admin/dashboard`)
- Overview of platform statistics
- Total users, orders, revenue, and products
- Active notifications and campaigns
- Pending support tickets
- Quick action buttons to all management sections

### 2. Customer Management (`/admin/customers`)
- View all registered customers
- Search customers by email
- View customer details including:
  - Total orders
  - Total spent
  - Join date
- Create invoices for specific customers

### 3. Product Management (`/admin/products`)
- View all products in catalog
- Create new products
- Edit existing products
- Delete products
- Manage product details:
  - Name, description, category
  - Price and discount percentage
  - Stock quantity and status
  - Image URL
  - Featured status

### 4. Sales & Discounts (`/admin/sales`)
- Create discount campaigns
- Set discount percentages
- Define campaign duration (start/end dates)
- Select products to include in campaign
- Activate/deactivate campaigns
- View all active and past campaigns

### 5. Notifications (`/admin/notifications`)
- Send notifications to users
- Choose recipients:
  - All users
  - Specific user
- Set notification type (announcement, promotion, update, alert)
- Add title, message, and optional link
- Preview notifications before sending

### 6. Invoice Management (`/admin/invoices`)
- View all invoices
- Create custom invoices for customers
- Set invoice amounts and currency
- Track invoice status (draft, paid, pending)
- Invoices automatically notify customers

### 7. Analytics (`/admin/analytics`)
- Total revenue and growth percentage
- Total orders and growth percentage
- User and product statistics
- Top products by views
- Recent orders
- Performance trends

## Security Features

- Session-based authentication
- 8-hour session timeout
- Secure credential storage
- Admin activity logging (database level)
- Role-based access control ready

## Database Tables

The admin panel uses the following dedicated tables:

- `admin_users` - Admin account information
- `admin_activity_logs` - Audit trail of admin actions
- `sales_campaigns` - Discount campaigns
- `stripe_invoices` - Customer invoices
- `notifications` - User notifications
- `support_tickets` - Customer support requests

## Stripe Integration Note

The invoice system is ready for Stripe integration. To enable automatic payment processing:

1. Add Stripe API keys to environment variables
2. Create Stripe Edge Function for invoice processing
3. Update invoice creation to use Stripe API

Current implementation creates draft invoices that can be manually processed.

## Best Practices

1. **Regular Backups**: Always backup the database before making bulk changes
2. **Test Campaigns**: Create test sales campaigns before going live
3. **Monitor Analytics**: Check analytics regularly to track platform performance
4. **Customer Support**: Respond to support tickets promptly
5. **Secure Credentials**: Change default admin credentials immediately in production

## Troubleshooting

### Cannot Log In
- Verify credentials match environment variables or defaults
- Check browser console for errors
- Clear localStorage and try again

### Data Not Loading
- Check Supabase connection in `.env` file
- Verify RLS policies are correctly configured
- Check browser network tab for API errors

### Products Not Updating
- Ensure you have a stable internet connection
- Verify product data is valid before saving
- Check that image URLs are accessible

## Support

For issues or questions about the admin panel, please contact the development team.
