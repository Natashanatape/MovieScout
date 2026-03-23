const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function createTables() {
  try {
    console.log('🎬 Creating Phase 5 tables...\n');
    
    const sql = fs.readFileSync('./setup_phase5.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            throw err;
          }
        }
      }
    }
    
    console.log('✅ Tables created/verified!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTables();
