-- ProbateEdge Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'solo', 'investor', 'team')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'plan', 'free')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county TEXT NOT NULL,
  decedent_name TEXT NOT NULL,
  case_number TEXT NOT NULL,
  filing_date DATE NOT NULL,
  executor_name TEXT,
  executor_address TEXT,
  property_address TEXT,
  parcel_id TEXT,
  assessed_value NUMERIC,
  estimated_market_value NUMERIC,
  mortgage_balance_estimate NUMERIC,
  estimated_equity NUMERIC,
  deal_score INTEGER,
  deal_score_reason TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'skipped', 'saved')),
  county_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_leads_county ON leads(county);
CREATE INDEX IF NOT EXISTS idx_leads_deal_score ON leads(deal_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_leads_filing_date ON leads(filing_date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_case_number ON leads(case_number);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Alert settings table
CREATE TABLE IF NOT EXISTS alert_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  min_deal_score INTEGER DEFAULT 75,
  counties TEXT[] DEFAULT '{}',
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Leads: authenticated users with active plan can read
CREATE POLICY "Authenticated users can read leads" ON leads
  FOR SELECT TO authenticated USING (true);

-- Alert settings: users can manage their own
CREATE POLICY "Users can manage own alerts" ON alert_settings
  FOR ALL USING (auth.uid() = user_id);
