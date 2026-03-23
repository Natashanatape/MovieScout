const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function removeDuplicateComedies() {
  try {
    // First, let's see what comedy movies exist
    const result = await pool.query(`
      SELECT id, title, COUNT(*) as count
      FROM movies 
      WHERE id IN (
        SELECT DISTINCT movie_id 
        FROM movie_genres mg 
        JOIN genres g ON mg.genre_id = g.id 
        WHERE g.name ILIKE '%comedy%'
      )
      GROUP BY id, title
      HAVING COUNT(*) > 1
      ORDER BY title
    `);

    console.log('Duplicate comedy movies found:');
    result.rows.forEach(row => {
      console.log(`${row.title}: ${row.count} copies (ID: ${row.id})`);
    });

    if (result.rows.length === 0) {
      // Check all comedy movies
      const allComedies = await pool.query(`
        SELECT m.id, m.title, m.release_date
        FROM movies m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.id
        WHERE g.name ILIKE '%comedy%'
        ORDER BY m.title
      `);
      
      console.log('\nAll comedy movies:');
      allComedies.rows.forEach(movie => {
        console.log(`ID: ${movie.id}, Title: ${movie.title}, Date: ${movie.release_date}`);
      });

      // Find duplicates by title
      const titleCounts = {};
      allComedies.rows.forEach(movie => {
        if (titleCounts[movie.title]) {
          titleCounts[movie.title].push(movie);
        } else {
          titleCounts[movie.title] = [movie];
        }
      });

      // Remove duplicates (keep the first one, delete others)
      for (const [title, movies] of Object.entries(titleCounts)) {
        if (movies.length > 1) {
          console.log(`\nRemoving duplicates for: ${title}`);
          for (let i = 1; i < movies.length; i++) {
            await pool.query('DELETE FROM movies WHERE id = $1', [movies[i].id]);
            console.log(`Deleted duplicate ID: ${movies[i].id}`);
          }
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

removeDuplicateComedies();