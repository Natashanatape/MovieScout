const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkComingSoonMovies() {
  try {
    const result = await pool.query(
      "SELECT id, title, release_date FROM movies WHERE release_date > CURRENT_DATE ORDER BY release_date"
    );
    console.log('Coming soon movies:');
    result.rows.forEach(movie => {
      console.log(`ID: ${movie.id}, Title: ${movie.title}, Release Date: ${movie.release_date}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkComingSoonMovies();