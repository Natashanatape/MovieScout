const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function updatePosters() {
  const client = await pool.connect();
  
  try {
    console.log('🖼️  Updating posters for existing movies...\n');
    
    const updates = [
      { title: 'Gully Boy', poster: 'http://localhost:5001/images/gullyboy.jpg' },
      { title: 'Bajrangi Bhaijaan', poster: 'http://localhost:5001/images/BajrangiBhaijaan.jpg' },
      { title: 'Zindagi Na Milegi Dobara', poster: 'http://localhost:5001/images/zindaginamilegidubara.jpg' },
      { title: '3 Idiots', poster: 'http://localhost:5001/images/3iditios.jpg' },
      { title: 'Andhadhun', poster: 'http://localhost:5001/images/Andhadhun.jpg' },
      { title: 'Drishyam', poster: 'http://localhost:5001/images/Drishyam.jpg' },
      { title: 'Dangal', poster: 'https://image.tmdb.org/t/p/w500/lWcAVj5GhOKjNJ9bKhz5NApkSVl.jpg' },
      { title: "Schindler's List", poster: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
      { title: 'Lagaan', poster: 'https://image.tmdb.org/t/p/w500/w3NkN8rNGCJLNs1V4Y8FJNcgLqB.jpg' },
      { title: 'Taare Zameen Par', poster: 'https://image.tmdb.org/t/p/w500/lhKGLTnNTKl4VHUeNNKZbcBXUKm.jpg' },
      { title: 'PK', poster: 'https://image.tmdb.org/t/p/w500/jMaJr0NLiH4hKULIY2xwYyBIp8X.jpg' }
    ];
    
    for (const { title, poster } of updates) {
      const result = await client.query(
        'UPDATE movies SET poster_url = $1, updated_at = NOW() WHERE title = $2 RETURNING id',
        [poster, title]
      );
      
      if (result.rows.length > 0) {
        console.log(`✅ Updated: ${title}`);
      } else {
        console.log(`⏭️  Not found: ${title}`);
      }
    }
    
    console.log('\n✨ Posters updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePosters();
