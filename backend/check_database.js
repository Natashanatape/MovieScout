const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('📊 DATABASE STATUS CHECK\n');

    // Check movies
    const movies = await client.query('SELECT COUNT(*) FROM movies');
    console.log(`🎬 Movies: ${movies.rows[0].count}`);

    // Check videos
    const videos = await client.query('SELECT COUNT(*) FROM videos');
    console.log(`📹 Videos: ${videos.rows[0].count}`);

    // Check celebrities
    const celebrities = await client.query('SELECT COUNT(*) FROM celebrities');
    console.log(`⭐ Celebrities: ${celebrities.rows[0].count}`);

    // Check users
    const users = await client.query('SELECT COUNT(*) FROM users');
    console.log(`👤 Users: ${users.rows[0].count}`);

    // Check reviews
    const reviews = await client.query('SELECT COUNT(*) FROM reviews');
    console.log(`📝 Reviews: ${reviews.rows[0].count}`);

    console.log('\n📋 Sample Movies:');
    const sampleMovies = await client.query('SELECT id, title FROM movies LIMIT 5');
    sampleMovies.rows.forEach(m => {
      console.log(`  ${m.id}. ${m.title}`);
    });

    console.log('\n📹 Sample Videos:');
    const sampleVideos = await client.query('SELECT id, title, movie_id, views_count FROM videos LIMIT 5');
    if (sampleVideos.rows.length > 0) {
      sampleVideos.rows.forEach(v => {
        console.log(`  ${v.id}. ${v.title} - Movie: ${v.movie_id} - Views: ${v.views_count || 0}`);
      });
    } else {
      console.log('  ❌ No videos found!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDatabase();
