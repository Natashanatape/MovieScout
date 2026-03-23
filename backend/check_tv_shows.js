const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function checkTVShows() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT id, title, poster_url, seasons, episodes 
      FROM movies 
      WHERE type = 'tv_show' 
      ORDER BY id
    `);
    
    console.log(`\n📺 Total TV Shows: ${result.rows.length}\n`);
    
    result.rows.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (ID: ${show.id})`);
      console.log(`   Poster: ${show.poster_url.substring(0, 60)}...`);
      console.log(`   ${show.seasons} seasons, ${show.episodes} episodes\n`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTVShows();
