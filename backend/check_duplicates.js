const db = require('./src/config/database');

const checkDuplicates = async () => {
  try {
    const result = await db.query(`
      SELECT poster_url, COUNT(*) as count, STRING_AGG(title, ', ') as movies 
      FROM movies 
      GROUP BY poster_url 
      HAVING COUNT(*) > 1 
      ORDER BY count DESC
    `);

    console.log('\n🔍 Checking for duplicate posters...\n');

    if (result.rows.length === 0) {
      console.log('✅ No duplicate posters found!\n');
    } else {
      console.log(`❌ Found ${result.rows.length} duplicate poster(s):\n`);
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. Used ${row.count} times:`);
        console.log(`   Movies: ${row.movies}`);
        console.log(`   URL: ${row.poster_url}\n`);
      });
    }

    // Also check all posters
    const allMovies = await db.query('SELECT id, title, poster_url FROM movies ORDER BY id');
    console.log(`\n📊 Total movies: ${allMovies.rows.length}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

checkDuplicates();
