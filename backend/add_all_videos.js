const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const allVideos = [
  // Movie 11 - Indiana Jones
  { movie_id: 11, title: 'Raiders of the Lost Ark - Trailer', video_url: 'https://www.youtube.com/watch?v=XkkzKHCx154', video_type: 'trailer', duration: 180 },
  { movie_id: 11, title: 'Indiana Jones - Behind The Scenes', video_url: 'https://www.youtube.com/watch?v=example11', video_type: 'behind_the_scenes', duration: 300 },
  
  // Movie 1
  { movie_id: 1, title: 'Movie 1 - Official Trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', video_type: 'trailer', duration: 150 },
  
  // Movie 2
  { movie_id: 2, title: 'Movie 2 - Trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', video_type: 'trailer', duration: 160 },
  
  // Movie 3
  { movie_id: 3, title: 'Movie 3 - Official Trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', video_type: 'trailer', duration: 140 },
  
  // Movie 4
  { movie_id: 4, title: 'Movie 4 - Trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', video_type: 'trailer', duration: 155 },
  
  // Movie 5
  { movie_id: 5, title: 'Movie 5 - Official Trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', video_type: 'trailer', duration: 145 },
];

async function addAllVideos() {
  const client = await pool.connect();
  
  try {
    console.log('Adding videos for all movies...\n');

    for (const video of allVideos) {
      await client.query(
        'INSERT INTO videos (movie_id, title, video_url, video_type, duration, views_count) VALUES ($1, $2, $3, $4, $5, 0)',
        [video.movie_id, video.title, video.video_url, video.video_type, video.duration]
      );
      console.log(`✅ Added: ${video.title}`);
    }

    console.log('\n🎉 All videos added!\n');

    // Show summary
    const result = await client.query('SELECT movie_id, COUNT(*) as count FROM videos GROUP BY movie_id ORDER BY movie_id');
    console.log('Videos per movie:');
    result.rows.forEach(row => {
      console.log(`  Movie ${row.movie_id}: ${row.count} videos`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addAllVideos();
