/*
  # Add License Management System

  1. New Tables
    - `licenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `order_id` (uuid, references orders)
      - `license_key` (text, unique) - Generated license key
      - `status` (text) - active, expired, revoked
      - `activated_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

    - `license_activations`
      - `id` (uuid, primary key)
      - `license_id` (uuid, references licenses)
      - `device_info` (jsonb) - Store device details
      - `ip_address` (text)
      - `activated_at` (timestamptz)

  2. Modifications
    - Add `is_digital` to products table (for digital products with licenses)
    - Add `max_activations` to products table

  3. Security
    - Enable RLS on all tables
    - Users can view their own licenses
    - Users can create activations for their own licenses
*/

-- Add columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_digital'
  ) THEN
    ALTER TABLE products ADD COLUMN is_digital boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'max_activations'
  ) THEN
    ALTER TABLE products ADD COLUMN max_activations integer DEFAULT 3;
  END IF;
END $$;

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  license_key text UNIQUE NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CHECK (status IN ('active', 'expired', 'revoked'))
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own licenses"
  ON licenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create licenses"
  ON licenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own licenses"
  ON licenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- License activations table
CREATE TABLE IF NOT EXISTS license_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid REFERENCES licenses(id) ON DELETE CASCADE NOT NULL,
  device_info jsonb DEFAULT '{}',
  ip_address text,
  activated_at timestamptz DEFAULT now()
);

ALTER TABLE license_activations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own license activations"
  ON license_activations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.id = license_activations.license_id
      AND licenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create license activations"
  ON license_activations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.id = license_activations.license_id
      AND licenses.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_order_id ON licenses(order_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_license_activations_license_id ON license_activations(license_id);

-- Function to generate license key
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..4 LOOP
    IF i > 1 THEN
      result := result || '-';
    END IF;
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
