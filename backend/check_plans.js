const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkPlans() {
  try {
    const result = await pool.query('SELECT * FROM subscription_plans ORDER BY id');
    console.log('\n📋 Current Plans in Database:\n');
    result.rows.forEach(plan => {
      console.log(`${plan.name}: ₹${plan.price} (${plan.duration_months} months)`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPlans();
