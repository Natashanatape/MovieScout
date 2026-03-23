const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkMovies() {
  const client = await pool.connect();
  
  try {
    console.log('📊 CHECKING ALL MOVIES:\n');

    const result = await client.query(`
      SELECT id, title, type, language 
      FROM movies 
      ORDER BY id
    `);
    
    console.log('Total movies:', result.rows.length);
    console.log('\nOriginal Movies (type IS NULL AND language IS NULL):');
    result.rows.forEach(row => {
      if (!row.type && !row.language) {
        console.log(`${row.id}. ${row.title}`);
      }
    });

    console.log('\nTV Shows (type = tv_show):');
    result.rows.forEach(row => {
      if (row.type === 'tv_show') {
        console.log(`${row.id}. ${row.title}`);
      }
    });

    console.log('\nIndian Movies (language NOT NULL):');
    result.rows.forEach(row => {
      if (row.language) {
        console.log(`${row.id}. ${row.title} (${row.language})`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkMovies();
