-- SQL for Supabase Setup

-- 1. PROFILES Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT, -- Keeping this for backward compatibility or switching to category_id
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  flavor_profile JSONB DEFAULT '{}'::jsonb,
  warming_instructions TEXT,
  is_daily_bake BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SHIPPING METHODS Table
CREATE TABLE shipping_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  estimated_days TEXT
);

-- ... (later in RLS section)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories." ON categories FOR ALL
  USING (
    (auth.jwt() ->> 'email' = 'tafs4918@gmail.com') OR 
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );

-- 4. ORDERS Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_method_id UUID REFERENCES shipping_methods(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

-- 6. CART ITEMS Table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  UNIQUE(user_id, product_id)
);

-- 7. SITE SETTINGS Table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_color TEXT DEFAULT '#FBBF24',
  secondary_color TEXT DEFAULT '#FFFFFF',
  logo_url TEXT,
  hero_title TEXT,
  hero_subtitle TEXT
);

-- RLS (Row Level Security)

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can create own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can delete profiles." ON profiles FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Products Policies
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT 
  USING (is_active = true OR (auth.jwt() ->> 'email' = 'tafs4918@gmail.com') OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')));
CREATE POLICY "Only admins can modify products." ON products FOR ALL 
  USING (
    (auth.jwt() ->> 'email' = 'tafs4918@gmail.com') OR 
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );

-- Orders Policies
CREATE POLICY "Users can view own orders." ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders." ON orders FOR SELECT 
  USING (
    (auth.jwt() ->> 'email' = 'tafs4918@gmail.com') OR 
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );
CREATE POLICY "Admins can update orders." ON orders FOR UPDATE
  USING (
    (auth.jwt() ->> 'email' = 'tafs4918@gmail.com') OR 
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );

-- Set up Admin Role Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id, 
    new.email,
    CASE 
      WHEN new.email = 'tafs4918@gmail.com' THEN 'admin' 
      ELSE 'user' 
    END,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
