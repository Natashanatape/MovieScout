const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkDuplicatePosters() {
  try {
    // Check for duplicate poster URLs
    const result = await pool.query(`
      SELECT poster_url, COUNT(*) as count, array_agg(title) as titles, array_agg(id) as ids
      FROM movies 
      WHERE poster_url IS NOT NULL AND poster_url != ''
      GROUP BY poster_url
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    console.log('Duplicate poster URLs found:');
    console.log('============================');
    
    if (result.rows.length === 0) {
      console.log('No duplicate posters found');
      
      // Show all posters for verification
      const allPosters = await pool.query(`
        SELECT id, title, poster_url 
        FROM movies 
        WHERE poster_url IS NOT NULL AND poster_url != ''
        ORDER BY title
      `);
      
      console.log('\nAll movie posters:');
      console.log('==================');
      allPosters.rows.forEach(movie => {
        console.log(`${movie.title}: ${movie.poster_url}`);
      });
      
    } else {
      result.rows.forEach(row => {
        console.log(`Poster URL: ${row.poster_url}`);
        console.log(`Used by ${row.count} movies: ${row.titles.join(', ')}`);
        console.log(`IDs: ${row.ids.join(', ')}`);
        console.log('---');
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkDuplicatePosters();