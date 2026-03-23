-- Phase 4: Payment & Subscription Tables

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_months INTEGER NOT NULL,
  features JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id),
  status VARCHAR(20) DEFAULT 'active',
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment History
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  invoice_number VARCHAR(50) UNIQUE,
  invoice_url TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pro Contacts (for celebrities)
CREATE TABLE IF NOT EXISTS pro_contacts (
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
  contact_type VARCHAR(50),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  event_type VARCHAR(50),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pro Analytics Summary
CREATE TABLE IF NOT EXISTS pro_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
  metric_type VARCHAR(50),
  value INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Subscription Plans (Netflix style)
INSERT INTO subscription_plans (name, price, duration_months, features) VALUES
('Mobile', 149, 1, '{"screens": 1, "quality": "480p", "downloads": true, "badge": true}'),
('Basic', 199, 1, '{"screens": 1, "quality": "720p", "downloads": true, "badge": true, "contacts": false}'),
('Standard', 499, 1, '{"screens": 2, "quality": "1080p", "downloads": true, "badge": true, "contacts": true, "analytics": true}'),
('Premium', 649, 1, '{"screens": 4, "quality": "4K+HDR", "downloads": true, "badge": true, "contacts": true, "analytics": true, "priority_support": true}');

-- Sample Pro Contacts
INSERT INTO pro_contacts (person_id, contact_type, name, email, phone, company) VALUES
(1, 'Agent', 'John Smith', 'john@talentcorp.com', '+1-555-0101', 'Talent Corp Agency'),
(1, 'Manager', 'Sarah Johnson', 'sarah@starmanagement.com', '+1-555-0102', 'Star Management'),
(2, 'Agent', 'Michael Brown', 'michael@elitetalent.com', '+1-555-0103', 'Elite Talent Agency'),
(3, 'Publicist', 'Emily Davis', 'emily@prpros.com', '+1-555-0104', 'PR Professionals');

-- Create indexes
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_analytics_entity ON analytics_events(entity_type, entity_id);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);
CREATE INDEX idx_pro_analytics_date ON pro_analytics(date);

COMMIT;
