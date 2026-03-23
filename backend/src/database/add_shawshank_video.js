const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function addShawshank() {
  try {
    await pool.query(`
      INSERT INTO videos (movie_id, title, video_url, thumbnail_url, video_type, duration)
      VALUES 
      (1, 'The Shawshank Redemption - Official Trailer', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 
       'https://images.unsplash.com/photo-1574267432644-f610a5c0c5e0?w=500&h=350&fit=crop', 'trailer', 150)
    `);
    console.log('✅ Shawshank video added!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

addShawshank();
