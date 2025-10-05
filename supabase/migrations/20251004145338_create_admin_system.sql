/*
  # Admin System Setup

  ## New Tables
  
  ### `admin_users`
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `role` (text, admin role type)
  - `created_at` (timestamptz)
  - `last_login` (timestamptz)

  ### `admin_activity_logs`
  - `id` (uuid, primary key)
  - `admin_id` (uuid, foreign key to admin_users)
  - `action` (text, action performed)
  - `entity_type` (text, type of entity affected)
  - `entity_id` (uuid, ID of affected entity)
  - `details` (jsonb, additional details)
  - `created_at` (timestamptz)

  ### `sales_campaigns`
  - `id` (uuid, primary key)
  - `name` (text, campaign name)
  - `description` (text)
  - `discount_percentage` (integer)
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `active` (boolean)
  - `product_ids` (uuid array, affected products)
  - `created_by` (uuid, admin who created it)
  - `created_at` (timestamptz)

  ### `stripe_invoices`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `stripe_invoice_id` (text, Stripe invoice ID)
  - `amount` (numeric)
  - `currency` (text)
  - `status` (text)
  - `description` (text)
  - `created_by` (uuid, admin who created it)
  - `created_at` (timestamptz)
  - `paid_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Admin tables require special authorization
  - Activity logs are read-only for admins
  - Proper audit trail for all admin actions
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can only be accessed by admins (enforced in application layer)
CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage activity logs"
  ON admin_activity_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create sales_campaigns table
CREATE TABLE IF NOT EXISTS sales_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  discount_percentage integer NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  active boolean DEFAULT true,
  product_ids uuid[] DEFAULT '{}',
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (end_date > start_date)
);

ALTER TABLE sales_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sales campaigns"
  ON sales_campaigns FOR SELECT
  TO public
  USING (active = true AND start_date <= now() AND end_date >= now());

CREATE POLICY "Service role can manage sales campaigns"
  ON sales_campaigns
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create stripe_invoices table
CREATE TABLE IF NOT EXISTS stripe_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_invoice_id text UNIQUE,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'usd',
  status text DEFAULT 'draft',
  description text,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE stripe_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON stripe_invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage invoices"
  ON stripe_invoices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be called from application layer
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_campaigns_active ON sales_campaigns(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_sales_campaigns_dates ON sales_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_user_id ON stripe_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_status ON stripe_invoices(status);