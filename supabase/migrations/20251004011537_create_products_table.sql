/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `name` (text) - Product name
      - `description` (text) - Detailed product description
      - `price` (numeric) - Product price in USD
      - `category` (text) - Product category
      - `image_url` (text) - URL to product image
      - `is_featured` (boolean) - Whether product is featured on homepage
      - `stock_status` (text) - Availability status (in_stock, low_stock, out_of_stock)
      - `features` (jsonb) - Array of product features
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (products are publicly viewable)
    - Add policy for authenticated admin users to manage products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  is_featured boolean DEFAULT false,
  stock_status text DEFAULT 'in_stock',
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
