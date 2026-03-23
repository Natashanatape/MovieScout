const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function fixOriginalMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 FIXING ORIGINAL 11 MOVIES...\n');

    // Set language to NULL for original 11 movies (IDs 1-11)
    await client.query(`
      UPDATE movies 
      SET language = NULL 
      WHERE id BETWEEN 1 AND 11
    `);
    
    console.log('✅ Original 11 movies language set to NULL\n');

    // Verify
    const result = await client.query(`
      SELECT id, title, type, language 
      FROM movies 
      WHERE id BETWEEN 1 AND 11
      ORDER BY id
    `);
    
    console.log('📊 ORIGINAL 11 MOVIES:\n');
    result.rows.forEach(row => {
      console.log(`${row.id}. ${row.title} - Type: ${row.type || 'NULL'}, Language: ${row.language || 'NULL'}`);
    });

    console.log('\n✅ DONE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixOriginalMovies();
