const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const sampleVideos = [
  { movie_id: 6, title: 'Fight Club - Official Trailer', video_url: 'https://www.youtube.com/watch?v=SUXWAEX2jlg', video_type: 'trailer', duration: 150 },
  { movie_id: 7, title: 'Forrest Gump - Trailer', video_url: 'https://www.youtube.com/watch?v=bLvqoHBptjg', video_type: 'trailer', duration: 180 },
  { movie_id: 8, title: 'The Matrix - Official Trailer', video_url: 'https://www.youtube.com/watch?v=vKQi3bBA1y8', video_type: 'trailer', duration: 145 },
  { movie_id: 9, title: 'The Hangover - Trailer', video_url: 'https://www.youtube.com/watch?v=tcdUhdOlz9M', video_type: 'trailer', duration: 135 },
  { movie_id: 10, title: 'The Conjuring - Official Trailer', video_url: 'https://www.youtube.com/watch?v=k10ETZ41q5o', video_type: 'trailer', duration: 155 },
  { movie_id: 6, title: 'Fight Club - Behind The Scenes', video_url: 'https://www.youtube.com/watch?v=example1', video_type: 'behind_the_scenes', duration: 300 },
  { movie_id: 8, title: 'The Matrix - Making Of', video_url: 'https://www.youtube.com/watch?v=example2', video_type: 'behind_the_scenes', duration: 420 },
];

async function addVideos() {
  const client = await pool.connect();
  
  try {
    console.log('🎬 Adding sample videos...\n');

    for (const video of sampleVideos) {
      await client.query(
        'INSERT INTO videos (movie_id, title, video_url, video_type, duration, views_count) VALUES ($1, $2, $3, $4, $5, 0)',
        [video.movie_id, video.title, video.video_url, video.video_type, video.duration]
      );
      console.log(`✅ Added: ${video.title}`);
    }

    console.log('\n🎉 All videos added successfully!\n');

    // Show count
    const result = await client.query('SELECT COUNT(*) FROM videos');
    console.log(`📹 Total videos: ${result.rows[0].count}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addVideos();
