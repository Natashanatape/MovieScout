const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkAllDuplicates() {
  try {
    // Check for duplicate titles
    const result = await pool.query(`
      SELECT title, COUNT(*) as count, array_agg(id) as ids
      FROM movies 
      GROUP BY title
      HAVING COUNT(*) > 1
      ORDER BY title
    `);

    console.log('Duplicate movies found:');
    console.log('=====================');
    
    if (result.rows.length === 0) {
      console.log('No duplicates found');
    } else {
      for (const row of result.rows) {
        console.log(`Title: ${row.title}`);
        console.log(`Count: ${row.count}`);
        console.log(`IDs: ${row.ids.join(', ')}`);
        
        // Keep first ID, delete others
        const idsToDelete = row.ids.slice(1);
        for (const id of idsToDelete) {
          await pool.query('DELETE FROM movies WHERE id = $1', [id]);
          console.log(`Deleted duplicate ID: ${id}`);
        }
        console.log('---');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkAllDuplicates();