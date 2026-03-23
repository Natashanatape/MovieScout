const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MovieScout',
  password: 'postgres',
  port: 5432,
});

async function deleteBollywoodMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Deleting Bollywood movies only...\n');
    
    // List of Bollywood movie titles to delete
    const bollywoodMovies = [
      '3 Idiots',
      'Dangal',
      'Bajrangi Bhaijaan',
      'Andhadhun',
      'Zindagi Na Milegi Dobara',
      'Gully Boy',
      'Drishyam',
      'Lagaan',
      'Taare Zameen Par',
      'PK'
    ];
    
    const result = await client.query(`
      DELETE FROM movies 
      WHERE title = ANY($1)
      RETURNING title
    `, [bollywoodMovies]);
    
    console.log(`✅ Deleted ${result.rows.length} Bollywood movies:\n`);
    result.rows.forEach(movie => {
      console.log(`  - ${movie.title}`);
    });
    
    console.log('\n✅ Bollywood movies removed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

deleteBollywoodMovies();
