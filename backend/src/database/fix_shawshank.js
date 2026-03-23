const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function fixShawshank() {
  try {
    const result = await pool.query(
      "SELECT id, title, thumbnail_url FROM videos WHERE title LIKE '%Shawshank%'"
    );
    
    console.log('Found videos:', result.rows);
    
    if (result.rows.length > 0) {
      for (const video of result.rows) {
        await pool.query(
          'UPDATE videos SET thumbnail_url = $1 WHERE id = $2',
          ['https://images.unsplash.com/photo-1574267432644-f610a5c0c5e0?w=500&h=350&fit=crop', video.id]
        );
        console.log(`✅ Updated video ${video.id}: ${video.title}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixShawshank();
