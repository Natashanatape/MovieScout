const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function updateShawshank() {
  try {
    await pool.query(`
      UPDATE videos 
      SET thumbnail_url = 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg'
      WHERE title LIKE '%Shawshank%'
    `);
    console.log('✅ Shawshank thumbnail updated!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateShawshank();
