const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function deleteComedyMovies() {
  try {
    // Delete comedy movies by title
    const comedyTitles = ['3 Idiots', 'Zindagi Na Milegi Dobara', 'The Hangover', 'Superbad', 'Step Brothers'];
    
    for (const title of comedyTitles) {
      const result = await pool.query('DELETE FROM movies WHERE title = $1', [title]);
      if (result.rowCount > 0) {
        console.log(`Deleted: ${title}`);
      }
    }

    console.log('All comedy movies deleted!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

deleteComedyMovies();