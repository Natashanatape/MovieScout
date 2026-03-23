const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkPosters() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT id, title, poster_url 
      FROM movies 
      WHERE id BETWEEN 1 AND 11
      ORDER BY id
    `);
    
    console.log('📊 CHECKING POSTERS:\n');
    result.rows.forEach(row => {
      console.log(`${row.id}. ${row.title}`);
      console.log(`   ${row.poster_url}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkPosters();
