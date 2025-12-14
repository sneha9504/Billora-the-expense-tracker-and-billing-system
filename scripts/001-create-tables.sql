-- Billora Business Management System - Database Schema
-- Create tables for products, transactions, expenses, and shops

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Shops Table
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo TEXT,
  address TEXT,
  gst_number TEXT,
  phone TEXT,
  email TEXT,
  tax_rate DECIMAL(5,2) DEFAULT 5.00,
  currency TEXT DEFAULT 'INR',
  receipt_header TEXT DEFAULT 'Thank you for shopping with us!',
  receipt_footer TEXT DEFAULT 'Visit Again!',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0,
  gst_percentage DECIMAL(5,2) DEFAULT 5.00,
  stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  unit TEXT DEFAULT 'pcs',
  image TEXT,
  description TEXT,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'card', 'upi', 'multiple')),
  payment_details JSONB DEFAULT '{}',
  customer_name TEXT,
  customer_phone TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'pending', 'delayed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  vendor TEXT,
  payment_mode TEXT DEFAULT 'cash',
  description TEXT,
  receipt TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'weekly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Categories Table (for product categories)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_transactions_shop ON transactions(shop_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_expenses_shop ON expenses(shop_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shops
CREATE POLICY "Users can view their own shops" ON shops
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shops" ON shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shops" ON shops
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shops" ON shops
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for products (through shop ownership)
CREATE POLICY "Users can view products in their shops" ON products
  FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can insert products in their shops" ON products
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can update products in their shops" ON products
  FOR UPDATE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can delete products in their shops" ON products
  FOR DELETE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()));

-- RLS Policies for transactions (through shop ownership)
CREATE POLICY "Users can view transactions in their shops" ON transactions
  FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = transactions.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can insert transactions in their shops" ON transactions
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM shops WHERE shops.id = transactions.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can update transactions in their shops" ON transactions
  FOR UPDATE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = transactions.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can delete transactions in their shops" ON transactions
  FOR DELETE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = transactions.shop_id AND shops.user_id = auth.uid()));

-- RLS Policies for expenses (through shop ownership)
CREATE POLICY "Users can view expenses in their shops" ON expenses
  FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = expenses.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can insert expenses in their shops" ON expenses
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM shops WHERE shops.id = expenses.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can update expenses in their shops" ON expenses
  FOR UPDATE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = expenses.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can delete expenses in their shops" ON expenses
  FOR DELETE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = expenses.shop_id AND shops.user_id = auth.uid()));

-- RLS Policies for categories (through shop ownership)
CREATE POLICY "Users can view categories in their shops" ON categories
  FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = categories.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can insert categories in their shops" ON categories
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM shops WHERE shops.id = categories.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can update categories in their shops" ON categories
  FOR UPDATE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = categories.shop_id AND shops.user_id = auth.uid()));
CREATE POLICY "Users can delete categories in their shops" ON categories
  FOR DELETE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = categories.shop_id AND shops.user_id = auth.uid()));
