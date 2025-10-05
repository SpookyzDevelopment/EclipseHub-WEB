/*
  # Enhanced Features System for ALXNE

  ## New Tables
  
  ### `product_categories`
  - `id` (uuid, primary key)
  - `name` (text, category name)
  - `slug` (text, URL-friendly name)
  - `description` (text, category description)
  - `created_at` (timestamptz)

  ### `product_tags`
  - `id` (uuid, primary key)
  - `name` (text, tag name)
  - `created_at` (timestamptz)

  ### `product_category_mapping`
  - `product_id` (uuid, foreign key to products)
  - `category_id` (uuid, foreign key to product_categories)
  - Primary key on both columns

  ### `product_tag_mapping`
  - `product_id` (uuid, foreign key to products)
  - `tag_id` (uuid, foreign key to product_tags)
  - Primary key on both columns

  ### `product_reviews`
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key to products)
  - `user_id` (uuid, foreign key to auth.users)
  - `rating` (integer, 1-5)
  - `title` (text, review title)
  - `comment` (text, review content)
  - `verified_purchase` (boolean)
  - `helpful_count` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `recently_viewed`
  - `user_id` (uuid, foreign key to auth.users)
  - `product_id` (uuid, foreign key to products)
  - `viewed_at` (timestamptz)
  - Primary key on user_id and product_id

  ### `product_comparisons`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `product_ids` (uuid array, products to compare)
  - `created_at` (timestamptz)

  ### `notifications`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `type` (text, notification type)
  - `title` (text, notification title)
  - `message` (text, notification content)
  - `read` (boolean)
  - `link` (text, optional link)
  - `created_at` (timestamptz)

  ### `support_tickets`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `subject` (text)
  - `message` (text)
  - `status` (text, default 'open')
  - `priority` (text, default 'normal')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `faqs`
  - `id` (uuid, primary key)
  - `question` (text)
  - `answer` (text)
  - `category` (text)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ## Modified Tables

  ### `products`
  - Added `stock_quantity` (integer, default 0)
  - Added `low_stock_threshold` (integer, default 5)
  - Added `discount_percentage` (integer, default 0)
  - Added `original_price` (numeric, nullable)
  - Added `average_rating` (numeric, default 0)
  - Added `review_count` (integer, default 0)
  - Added `views_count` (integer, default 0)

  ### `orders`
  - Added `tracking_number` (text, nullable)
  - Added `tracking_status` (text, default 'pending')
  - Added `estimated_delivery` (timestamptz, nullable)

  ## Security
  - Enable RLS on all new tables
  - Add policies for authenticated users to manage their own data
  - Add policies for public read access where appropriate
  - Restrict admin operations appropriately
*/

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON product_categories FOR SELECT
  TO public
  USING (true);

-- Create product_tags table
CREATE TABLE IF NOT EXISTS product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON product_tags FOR SELECT
  TO public
  USING (true);

-- Create product_category_mapping table
CREATE TABLE IF NOT EXISTS product_category_mapping (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

ALTER TABLE product_category_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories"
  ON product_category_mapping FOR SELECT
  TO public
  USING (true);

-- Create product_tag_mapping table
CREATE TABLE IF NOT EXISTS product_tag_mapping (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES product_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

ALTER TABLE product_tag_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product tags"
  ON product_tag_mapping FOR SELECT
  TO public
  USING (true);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON product_reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON product_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create recently_viewed table
CREATE TABLE IF NOT EXISTS recently_viewed (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recently viewed"
  ON recently_viewed FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed"
  ON recently_viewed FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed"
  ON recently_viewed FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create product_comparisons table
CREATE TABLE IF NOT EXISTS product_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_ids uuid[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own comparisons"
  ON product_comparisons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons"
  ON product_comparisons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON product_comparisons FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open',
  priority text DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQs"
  ON faqs FOR SELECT
  TO public
  USING (true);

-- Add new columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'low_stock_threshold'
  ) THEN
    ALTER TABLE products ADD COLUMN low_stock_threshold integer DEFAULT 5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE products ADD COLUMN discount_percentage integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE products ADD COLUMN original_price numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating numeric(3, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE products ADD COLUMN review_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE products ADD COLUMN views_count integer DEFAULT 0;
  END IF;
END $$;

-- Add new columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery'
  ) THEN
    ALTER TABLE orders ADD COLUMN estimated_delivery timestamptz;
  END IF;
END $$;

-- Create function to update product rating on review insert/update
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    average_rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM product_reviews
      WHERE product_id = NEW.product_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for review insert
DROP TRIGGER IF EXISTS update_rating_on_review_insert ON product_reviews;
CREATE TRIGGER update_rating_on_review_insert
AFTER INSERT ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Create trigger for review update
DROP TRIGGER IF EXISTS update_rating_on_review_update ON product_reviews;
CREATE TRIGGER update_rating_on_review_update
AFTER UPDATE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Insert sample categories
INSERT INTO product_categories (name, slug, description) VALUES
  ('Software Licenses', 'software-licenses', 'Professional software licenses and tools'),
  ('Digital Assets', 'digital-assets', 'Graphics, templates, and digital resources'),
  ('Security & Privacy', 'security-privacy', 'Security tools and privacy solutions'),
  ('Productivity', 'productivity', 'Productivity and automation tools')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO product_tags (name) VALUES
  ('Premium'),
  ('Lifetime'),
  ('Popular'),
  ('New'),
  ('Best Seller'),
  ('Limited Time')
ON CONFLICT (name) DO NOTHING;

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, order_index) VALUES
  ('How do I receive my license key?', 'After completing your purchase, your license key will be sent to your registered email address immediately. You can also find it in your Dashboard under "Orders".', 'Orders & Licenses', 1),
  ('Can I use my license on multiple devices?', 'This depends on the specific product. Most licenses allow installation on 1-3 devices. Please check the product description for specific details.', 'Licenses', 2),
  ('What is your refund policy?', 'We offer a 30-day money-back guarantee on all purchases. If you are not satisfied with your purchase, contact our support team for a full refund.', 'Payments & Refunds', 3),
  ('How long does it take to process orders?', 'Digital orders are processed instantly. You will receive your license key and download links within minutes of completing your purchase.', 'Orders & Licenses', 4),
  ('Do you offer customer support?', 'Yes! We provide 24/7 customer support via email and live chat. Premium customers get priority support.', 'Support', 5)
ON CONFLICT DO NOTHING;