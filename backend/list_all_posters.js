const db = require('./src/config/database');

const listAllPosters = async () => {
  try {
    const result = await db.query('SELECT id, title, poster_url FROM movies ORDER BY id');

    console.log('\n📋 All Movies with Posters:\n');
    console.log('='.repeat(100));
    
    result.rows.forEach((movie) => {
      console.log(`\n${movie.id}. ${movie.title}`);
      console.log(`   ${movie.poster_url}`);
    });

    console.log('\n' + '='.repeat(100));
    console.log(`\nTotal: ${result.rows.length} movies\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

listAllPosters();
