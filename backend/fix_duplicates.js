const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixDuplicates() {
  try {
    console.log('🔍 Checking for duplicates...\n');

    const check = await pool.query(`
      SELECT movie_id, COUNT(*) as count 
      FROM upcoming_releases 
      GROUP BY movie_id 
      HAVING COUNT(*) > 1
    `);

    if (check.rows.length > 0) {
      console.log(`❌ Found ${check.rows.length} duplicate movies`);
      
      console.log('🧹 Removing duplicates...');
      await pool.query(`
        DELETE FROM upcoming_releases a USING upcoming_releases b
        WHERE a.id < b.id AND a.movie_id = b.movie_id
      `);
      console.log('✅ Duplicates removed\n');
    } else {
      console.log('✅ No duplicates found\n');
    }

    const total = await pool.query('SELECT COUNT(*) FROM upcoming_releases');
    console.log(`📊 Total upcoming releases: ${total.rows[0].count}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDuplicates();
