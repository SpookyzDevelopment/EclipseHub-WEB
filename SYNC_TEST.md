# Product Sync Test Instructions

## How to Test Admin ↔ Website Sync

### Setup
1. Open the website in your browser
2. Open browser DevTools (F12) and go to Console tab

### Test 1: Add a Product
1. Navigate to `/admin/login`
2. Login with:
   - Email: `admin@alxne.com`
   - Password: `Admin123!@#`
3. Click "Add Product" button
4. Fill in product details:
   - Name: Test Product
   - Category: Accounts
   - Description: Test Description
   - Price: 99.99
   - Image URL: `https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg`
   - Check "Featured Product" checkbox
5. Click "Create Product"
6. Watch the console - you should see: "✅ Product created: Test Product - Dispatching update event"
7. Navigate to `/products` - Within 2 seconds, you should see your new product
8. Navigate to home `/` - Your product should appear in Featured Products section

### Test 2: Edit a Product
1. In admin panel, click "Edit" on any product
2. Change the name or price
3. Click "Save Changes"
4. Watch console for: "✅ Product updated"
5. Navigate to `/products` - Changes should appear within 2 seconds

### Test 3: Delete a Product
1. In admin panel, click the trash icon on a product
2. Confirm deletion
3. Watch console for: "✅ Product deleted"
4. Navigate to `/products` - Product should disappear within 2 seconds

### What You Should See in Console

When making changes in admin:
```
✅ Product created: Test Product - Dispatching update event
```

On the products page (automatically):
```
Polling detected product changes
Products updated event received - refreshing products list
```

Or:
```
Storage change detected - refreshing products list
```

## How It Works

The system uses **3 sync methods** simultaneously:

1. **Custom Events** - Instant updates via `products-updated` event
2. **Storage Events** - Browser's native localStorage change detection
3. **Polling (Fallback)** - Checks every 2 seconds automatically

This triple-redundancy ensures changes ALWAYS sync within 2 seconds maximum!

## Important Notes

- Changes persist in browser localStorage
- Works across tabs (open admin in one tab, products in another)
- Console logs help debug sync process
- No page refresh needed - updates happen automatically
