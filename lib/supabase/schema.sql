-- UW Marketplace Database Schema
-- This schema defines all the tables needed for the marketplace application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
-- Stores user profile information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- bcrypt hashed password
  full_name TEXT,
  profile_picture_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- VERIFICATION CODES TABLE
-- =====================================================
-- Stores email verification codes for authentication
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL, -- 6-digit verification code
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Index for faster verification code lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);

-- =====================================================
-- LISTINGS TABLE
-- =====================================================
-- Stores marketplace listings/items for sale
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}', -- Array of image URLs
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);

-- Composite index for common queries (active listings by category)
CREATE INDEX IF NOT EXISTS idx_listings_status_category ON listings(status, category) WHERE status = 'active';

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
-- Stores messages between buyers and sellers
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for message queries
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Composite index for unread messages
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread ON messages(receiver_id, read) WHERE read = FALSE;

-- =====================================================
-- PRICE HISTORY TABLE
-- =====================================================
-- Stores historical pricing data for AI-powered price analysis
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for price analysis queries
CREATE INDEX IF NOT EXISTS idx_price_history_listing_id ON price_history(listing_id);
CREATE INDEX IF NOT EXISTS idx_price_history_category ON price_history(category);
CREATE INDEX IF NOT EXISTS idx_price_history_created_at ON price_history(created_at DESC);

-- Composite index for category-based price analysis
CREATE INDEX IF NOT EXISTS idx_price_history_category_created_at ON price_history(category, created_at DESC);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for listings table
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add price to price_history when listing is created
CREATE OR REPLACE FUNCTION add_to_price_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO price_history (listing_id, category, price)
  VALUES (NEW.id, NEW.category, NEW.price);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add price history when listing is created
DROP TRIGGER IF EXISTS add_listing_to_price_history ON listings;
CREATE TRIGGER add_listing_to_price_history
  AFTER INSERT ON listings
  FOR EACH ROW
  EXECUTE FUNCTION add_to_price_history();

-- Function to automatically clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_codes
  WHERE expires_at < NOW() AND used = TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read all user profiles
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verification codes policies
-- Anyone can insert verification codes (for signup)
CREATE POLICY "Anyone can create verification codes"
  ON verification_codes FOR INSERT
  WITH CHECK (true);

-- Anyone can read verification codes (for validation)
CREATE POLICY "Anyone can read verification codes"
  ON verification_codes FOR SELECT
  USING (true);

-- Listings table policies
-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());

-- Authenticated users can create listings
CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = seller_id);

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = seller_id);

-- Messages table policies
-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Authenticated users can send messages
CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Price history policies
-- Anyone can view price history (for AI analysis)
CREATE POLICY "Anyone can view price history"
  ON price_history FOR SELECT
  USING (true);

-- System automatically inserts price history (via trigger)
CREATE POLICY "System can insert price history"
  ON price_history FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

-- View for active listings with seller information
CREATE OR REPLACE VIEW active_listings_with_seller AS
SELECT
  l.*,
  u.full_name as seller_name,
  u.profile_picture_url as seller_picture
FROM listings l
JOIN users u ON l.seller_id = u.id
WHERE l.status = 'active';

-- View for message threads with latest message
CREATE OR REPLACE VIEW message_threads AS
SELECT DISTINCT ON (listing_id, LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
  m.*,
  l.title as listing_title,
  sender.full_name as sender_name,
  receiver.full_name as receiver_name
FROM messages m
JOIN listings l ON m.listing_id = l.id
JOIN users sender ON m.sender_id = sender.id
JOIN users receiver ON m.receiver_id = receiver.id
ORDER BY
  listing_id,
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id),
  created_at DESC;

-- =====================================================
-- SAMPLE DATA (Optional - for development/testing)
-- =====================================================

-- Uncomment below to add sample data for testing

/*
-- Insert sample users
INSERT INTO users (id, email, full_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'alice@uw.edu', 'Alice Johnson'),
  ('00000000-0000-0000-0000-000000000002', 'bob@uw.edu', 'Bob Smith'),
  ('00000000-0000-0000-0000-000000000003', 'charlie@uw.edu', 'Charlie Brown');

-- Insert sample listings
INSERT INTO listings (seller_id, title, description, price, category, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Used Calculus Textbook', 'Excellent condition, barely used', 45.99, 'Textbooks', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'Mini Fridge', 'Perfect for dorm room', 75.00, 'Furniture', 'active'),
  ('00000000-0000-0000-0000-000000000003', 'Bicycle', 'Great for campus commuting', 120.00, 'Transportation', 'active');
*/
