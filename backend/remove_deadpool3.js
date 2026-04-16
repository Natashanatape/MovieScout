const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function removeDeadpool3() {
  try {
    const result = await pool.query(
      "DELETE FROM movies WHERE title ILIKE '%deadpool%' AND title ILIKE '%3%'"
    );
    console.log(`Removed ${result.rowCount} Deadpool 3 movie(s)`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

removeDeadpool3();