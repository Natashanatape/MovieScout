const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MovieScout',
  password: 'postgres',
  port: 5432,
});

async function checkMovies() {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT id, title, language FROM movies ORDER BY id');
    
    console.log(`\n📊 Total movies: ${result.rows.length}\n`);
    result.rows.forEach(movie => {
      console.log(`  ${movie.id}. ${movie.title} ${movie.language ? `(${movie.language})` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkMovies();
