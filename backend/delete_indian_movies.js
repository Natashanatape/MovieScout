const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MovieScout',
  password: 'postgres',
  port: 5432,
});

async function deleteIndianMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Deleting all Indian movies...\n');
    
    // Delete all movies with language (Indian movies)
    const result = await client.query(`
      DELETE FROM movies 
      WHERE language IS NOT NULL 
      AND type = 'movie'
      RETURNING title, language
    `);
    
    console.log(`✅ Deleted ${result.rows.length} Indian movies:\n`);
    result.rows.forEach(movie => {
      console.log(`  - ${movie.title} (${movie.language})`);
    });
    
    console.log('\n✅ Homepage is now clean!');
    console.log('✅ Only original movies remain!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

deleteIndianMovies();
