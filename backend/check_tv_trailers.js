const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkTVTrailers() {
  try {
    const result = await pool.query(`
      SELECT m.title as show_title, v.title as video_title, v.video_url, v.video_type
      FROM videos v
      JOIN movies m ON v.movie_id = m.id
      WHERE m.type = 'tv'
      ORDER BY m.title
    `);

    console.log('TV Show Trailers:');
    console.log('==================');
    result.rows.forEach(row => {
      console.log(`Show: ${row.show_title}`);
      console.log(`Video: ${row.video_title}`);
      console.log(`URL: ${row.video_url}`);
      console.log(`Type: ${row.video_type}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkTVTrailers();