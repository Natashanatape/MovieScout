const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function updateToINR() {
  try {
    // Delete all related data
    await pool.query("DELETE FROM invoices");
    await pool.query("DELETE FROM payments");
    await pool.query("DELETE FROM subscriptions");
    await pool.query("DELETE FROM subscription_plans");
    
    // Insert Netflix-style plans
    await pool.query(`
      INSERT INTO subscription_plans (name, price, duration_months, features) VALUES
      ('Mobile', 149, 1, '{"screens": 1, "quality": "480p", "downloads": true, "badge": true}'),
      ('Basic', 199, 1, '{"screens": 1, "quality": "720p", "downloads": true, "badge": true, "contacts": false}'),
      ('Standard', 499, 1, '{"screens": 2, "quality": "1080p", "downloads": true, "badge": true, "contacts": true, "analytics": true}'),
      ('Premium', 649, 1, '{"screens": 4, "quality": "4K+HDR", "downloads": true, "badge": true, "contacts": true, "analytics": true, "priority_support": true}');
    `);
    
    console.log('✅ Netflix-style plans created!');
    console.log('Mobile: ₹149/month');
    console.log('Basic: ₹199/month');
    console.log('Standard: ₹499/month');
    console.log('Premium: ₹649/month');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateToINR();
