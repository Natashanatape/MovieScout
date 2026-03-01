const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function testAPI() {
  const client = await pool.connect();
  
  try {
    console.log('Testing Videos API...\n');

    // Get videos for movie 6
    const videos = await client.query('SELECT * FROM videos WHERE movie_id = 6');
    console.log(`Found ${videos.rows.length} videos for movie 6:`);
    videos.rows.forEach(v => {
      console.log(`  ID: ${v.id}, Title: ${v.title}, Views: ${v.views_count || 0}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testAPI();
