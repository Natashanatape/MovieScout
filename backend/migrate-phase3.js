const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigration() {
  try {
    console.log('🚀 Running Phase 3 migration...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, 'src/database/phase3_schema.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    
    console.log('✅ Phase 3 migration complete!');
    console.log('✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
