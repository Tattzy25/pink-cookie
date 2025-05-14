-- Create tables for Dessert Print Inc

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  is_admin BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  marketing_opt_in BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users
CREATE POLICY "Users can view and edit their own data" ON users
  FOR ALL USING (auth.uid() = id);
  
CREATE POLICY "Admins can view all user data" ON users
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  subcategory TEXT,
  occasion TEXT,
  image_url TEXT,
  additional_images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER DEFAULT 100,
  weight_in_grams INTEGER,
  dimensions TEXT,
  customizable BOOLEAN DEFAULT FALSE,
  available_shapes TEXT[],
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Products are editable by admins" ON products
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  shipping_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paypal_order_id TEXT,
  paypal_payer_id TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number TEXT,
  shipping_carrier TEXT,
  estimated_delivery_date DATE,
  notes TEXT,
  promo_code_id UUID,
  is_subscription BOOLEAN DEFAULT FALSE,
  subscription_id UUID
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Admins can view and edit all orders" ON orders
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  customization JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  design_id UUID
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for order items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM orders WHERE id = order_id
    )
  );
  
CREATE POLICY "Admins can view and edit all order items" ON order_items
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Designs table for saved custom designs
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  design_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  cookie_shape TEXT DEFAULT 'circle',
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Create policy for designs
CREATE POLICY "Users can view and edit their own designs" ON designs
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Public designs are viewable by everyone" ON designs
  FOR SELECT USING (is_public = TRUE);
  
CREATE POLICY "Admins can view all designs" ON designs
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Subscribers table for newsletter
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  mailerlite_id TEXT,
  source TEXT,
  last_campaign_sent DATE,
  interests TEXT[]
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for subscribers
CREATE POLICY "Admins can view and edit subscribers" ON subscribers
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT FALSE,
  category TEXT,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  read_time INTEGER,
  view_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for blog posts
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (is_published = TRUE OR auth.uid() = author_id);
  
CREATE POLICY "Blog posts are editable by authors and admins" ON blog_posts
  FOR ALL USING (
    auth.uid() = author_id OR 
    auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE)
  );

-- Promo codes table (NEW)
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed_amount', 'free_shipping'
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applies_to_category TEXT[],
  applies_to_product_ids UUID[],
  single_use_per_customer BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for promo codes
CREATE POLICY "Promo codes are viewable by everyone" ON promo_codes
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Promo codes are editable by admins" ON promo_codes
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- User promo code usage (NEW)
CREATE TABLE IF NOT EXISTS user_promo_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  promo_code_id UUID REFERENCES promo_codes(id),
  order_id UUID REFERENCES orders(id),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discount_amount DECIMAL(10, 2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_promo_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for user promo usage
CREATE POLICY "Users can view their own promo usage" ON user_promo_usage
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can view all promo usage" ON user_promo_usage
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Subscriptions table (NEW)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  frequency TEXT NOT NULL, -- 'weekly', 'biweekly', 'monthly'
  next_billing_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paypal_subscription_id TEXT,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  customization JSONB,
  shipping_address JSONB,
  billing_address JSONB
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for subscriptions
CREATE POLICY "Users can view and edit their own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can view and edit all subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Subscription history table (NEW)
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id),
  order_id UUID REFERENCES orders(id),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL, -- 'success', 'failed'
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Create policy for subscription history
CREATE POLICY "Users can view their own subscription history" ON subscription_history
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE id = subscription_id
    )
  );
  
CREATE POLICY "Admins can view all subscription history" ON subscription_history
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Reviews table (NEW)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  images TEXT[]
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = TRUE);
  
CREATE POLICY "Users can create and edit their own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can view and edit all reviews" ON reviews
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Media library table (NEW)
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Create policy for media library
CREATE POLICY "Public media is viewable by everyone" ON media_library
  FOR SELECT USING (is_public = TRUE);
  
CREATE POLICY "Users can view their own uploads" ON media_library
  FOR SELECT USING (auth.uid() = uploaded_by);
  
CREATE POLICY "Admins can view and edit all media" ON media_library
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Shipping zones table (NEW)
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  countries TEXT[],
  states TEXT[],
  zip_codes TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

-- Create policy for shipping zones
CREATE POLICY "Shipping zones are viewable by everyone" ON shipping_zones
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Admins can edit shipping zones" ON shipping_zones
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Shipping methods table (NEW)
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES shipping_zones(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  free_shipping_threshold DECIMAL(10, 2),
  estimated_delivery_days INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

-- Create policy for shipping methods
CREATE POLICY "Shipping methods are viewable by everyone" ON shipping_methods
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Admins can edit shipping methods" ON shipping_methods
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Tax rates table (NEW)
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  rate DECIMAL(5, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;

-- Create policy for tax rates
CREATE POLICY "Tax rates are viewable by everyone" ON tax_rates
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Admins can edit tax rates" ON tax_rates
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Knowledge base articles table (NEW)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES users(id),
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policy for knowledge base
CREATE POLICY "Knowledge base articles are viewable by everyone" ON knowledge_base
  FOR SELECT USING (is_published = TRUE);
  
CREATE POLICY "Admins can edit knowledge base articles" ON knowledge_base
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Contact form submissions table (NEW)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'resolved'
  assigned_to UUID REFERENCES users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for contact submissions
CREATE POLICY "Admins can view and edit contact submissions" ON contact_submissions
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'Product Images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('design-uploads', 'Design Uploads', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'Blog Images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'User Uploads', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media-library', 'Media Library', true) ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Product images are viewable by everyone" 
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Design uploads are viewable by everyone" 
ON storage.objects FOR SELECT
USING (bucket_id = 'design-uploads');

CREATE POLICY "Blog images are viewable by everyone" 
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "User uploads are private to the user" 
ON storage.objects FOR ALL
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Media library is viewable by everyone" 
ON storage.objects FOR SELECT
USING (bucket_id = 'media-library');

CREATE POLICY "Media library is editable by admins" 
ON storage.objects FOR ALL
USING (bucket_id = 'media-library' AND auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_occasion ON products(occasion);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_slug ON knowledge_base(slug);
