const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkTables() {
  const tables = [
    'trivia', 'goofs', 'quotes', 'user_reputation', 
    'comments', 'user_follows', 'polls', 'poll_options', 
    'poll_votes', 'notifications'
  ];

  console.log('🔍 Checking Phase 3 tables...\n');

  for (const table of tables) {
    try {
      const result = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )`,
        [table]
      );
      
      const exists = result.rows[0].exists;
      console.log(`${exists ? '✅' : '❌'} ${table}`);
    } catch (error) {
      console.log(`❌ ${table} - Error`);
    }
  }

  console.log('\n✅ Check complete!');
  process.exit(0);
}

checkTables();
