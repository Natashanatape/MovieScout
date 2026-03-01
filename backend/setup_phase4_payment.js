const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function setupPhase4Payment() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up Phase 4 Payment Features...\n');

    // Create subscription_plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        duration_months INTEGER NOT NULL,
        features JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created subscription_plans table');

    // Create subscriptions table
    await client.query(`
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
      )
    `);
    console.log('✓ Created subscriptions table');

    // Create payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subscription_id INTEGER REFERENCES subscriptions(id),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        stripe_payment_id VARCHAR(255),
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created payments table');

    // Create invoices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subscription_id INTEGER REFERENCES subscriptions(id),
        amount DECIMAL(10,2) NOT NULL,
        invoice_number VARCHAR(50) UNIQUE,
        invoice_url TEXT,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created invoices table');

    // Create pro_contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pro_contacts (
        id SERIAL PRIMARY KEY,
        person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
        contact_type VARCHAR(50),
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created pro_contacts table');

    // Create analytics_events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        event_type VARCHAR(50),
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created analytics_events table');

    // Create pro_analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pro_analytics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
        metric_type VARCHAR(50),
        value INTEGER DEFAULT 0,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created pro_analytics table');

    // Insert subscription plans
    const plansCheck = await client.query('SELECT COUNT(*) FROM subscription_plans');
    if (parseInt(plansCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO subscription_plans (name, price, duration_months, features) VALUES
        ('Monthly Pro', 19.99, 1, '{"badge": true, "contacts": true, "analytics": true, "priority_support": true}'),
        ('Yearly Pro', 199.99, 12, '{"badge": true, "contacts": true, "analytics": true, "priority_support": true, "discount": "17%"}'),
        ('Lifetime Pro', 499.99, 999, '{"badge": true, "contacts": true, "analytics": true, "priority_support": true, "lifetime_access": true}')
      `);
      console.log('✓ Inserted 3 subscription plans');
    }

    // Insert sample pro contacts
    const contactsCheck = await client.query('SELECT COUNT(*) FROM pro_contacts');
    if (parseInt(contactsCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO pro_contacts (person_id, contact_type, name, email, phone, company) VALUES
        (1, 'Agent', 'John Smith', 'john@talentcorp.com', '+1-555-0101', 'Talent Corp Agency'),
        (1, 'Manager', 'Sarah Johnson', 'sarah@starmanagement.com', '+1-555-0102', 'Star Management'),
        (2, 'Agent', 'Michael Brown', 'michael@elitetalent.com', '+1-555-0103', 'Elite Talent Agency'),
        (3, 'Publicist', 'Emily Davis', 'emily@prpros.com', '+1-555-0104', 'PR Professionals')
      `);
      console.log('✓ Inserted sample pro contacts');
    }

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_analytics_entity ON analytics_events(entity_type, entity_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_events(created_at)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_pro_analytics_date ON pro_analytics(date)');
    console.log('✓ Created indexes');

    console.log('\n✅ Phase 4 Payment Features Setup Complete!\n');
    console.log('📊 Summary:');
    console.log('   - 7 tables created');
    console.log('   - 3 subscription plans added');
    console.log('   - Sample pro contacts added');
    console.log('   - Indexes created\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupPhase4Payment();
