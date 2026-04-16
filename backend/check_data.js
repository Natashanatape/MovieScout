const db = require('./src/config/database');

async function checkData() {
  try {
    console.log('Checking database data...\n');

    // Check movies
    const moviesResult = await db.query('SELECT COUNT(*) FROM movies');
    console.log(`Movies: ${moviesResult.rows[0].count}`);

    // Check TV shows
    try {
      const tvResult = await db.query('SELECT COUNT(*) FROM tv_shows');
      console.log(`TV Shows: ${tvResult.rows[0].count}`);
    } catch (e) {
      console.log('TV Shows: Table does not exist');
    }

    // Check videos/trailers
    try {
      const videosResult = await db.query('SELECT COUNT(*) FROM videos');
      console.log(`Videos/Trailers: ${videosResult.rows[0].count}`);
    } catch (e) {
      console.log('Videos/Trailers: Table does not exist');
    }

    // Sample movies
    const sampleMovies = await db.query('SELECT id, title, release_date FROM movies LIMIT 5');
    console.log('\nSample Movies:');
    sampleMovies.rows.forEach(m => console.log(`- ${m.title} (${m.release_date})`));

    // Check all tables
    console.log('\n--- All Tables ---');
    const tables = await db.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    tables.rows.forEach(t => console.log(`- ${t.table_name}`));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkData();
