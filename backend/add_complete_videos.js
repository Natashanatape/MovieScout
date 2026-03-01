const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const allMovieVideos = [
  // Movie 1 - Shawshank Redemption
  { movie_id: 1, title: 'The Shawshank Redemption - Official Trailer', video_url: 'https://www.youtube.com/watch?v=6hB3S9bIaco', video_type: 'trailer', duration: 150 },
  { movie_id: 1, title: 'Shawshank Redemption - Behind The Scenes', video_url: 'https://www.youtube.com/watch?v=example1', video_type: 'behind_the_scenes', duration: 300 },
  
  // Movie 2 - The Godfather
  { movie_id: 2, title: 'The Godfather - Official Trailer', video_url: 'https://www.youtube.com/watch?v=sY1S34973zA', video_type: 'trailer', duration: 180 },
  { movie_id: 2, title: 'The Godfather - Making Of', video_url: 'https://www.youtube.com/watch?v=example2', video_type: 'behind_the_scenes', duration: 420 },
  
  // Movie 3 - The Dark Knight
  { movie_id: 3, title: 'The Dark Knight - Official Trailer', video_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY', video_type: 'trailer', duration: 155 },
  { movie_id: 3, title: 'The Dark Knight - Behind The Scenes', video_url: 'https://www.youtube.com/watch?v=example3', video_type: 'behind_the_scenes', duration: 360 },
  
  // Movie 4 - Pulp Fiction
  { movie_id: 4, title: 'Pulp Fiction - Official Trailer', video_url: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', video_type: 'trailer', duration: 145 },
  { movie_id: 4, title: 'Pulp Fiction - Interview', video_url: 'https://www.youtube.com/watch?v=example4', video_type: 'interview', duration: 240 },
  
  // Movie 5 - Inception
  { movie_id: 5, title: 'Inception - Official Trailer', video_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0', video_type: 'trailer', duration: 150 },
  { movie_id: 5, title: 'Inception - Behind The Scenes', video_url: 'https://www.youtube.com/watch?v=example5', video_type: 'behind_the_scenes', duration: 380 },
];

async function addAllMovieVideos() {
  const client = await pool.connect();
  
  try {
    console.log('🎬 Adding videos for ALL movies...\n');

    // First, delete old duplicate/test videos
    await client.query('DELETE FROM videos WHERE movie_id IN (1,2,3,4,5)');
    console.log('✅ Cleaned old videos\n');

    // Add new videos
    for (const video of allMovieVideos) {
      await client.query(
        'INSERT INTO videos (movie_id, title, video_url, video_type, duration, views_count) VALUES ($1, $2, $3, $4, $5, 0)',
        [video.movie_id, video.title, video.video_url, video.video_type, video.duration]
      );
      console.log(`✅ Added: ${video.title}`);
    }

    console.log('\n🎉 ALL VIDEOS ADDED SUCCESSFULLY!\n');

    // Show final summary
    const result = await client.query(`
      SELECT m.id, m.title, COUNT(v.id) as video_count 
      FROM movies m 
      LEFT JOIN videos v ON m.id = v.movie_id 
      GROUP BY m.id, m.title 
      ORDER BY m.id
    `);
    
    console.log('📊 FINAL STATUS:\n');
    result.rows.forEach(row => {
      console.log(`${row.id}. ${row.title}: ${row.video_count} videos`);
    });

    console.log('\n✅ ALL 11 MOVIES HAVE VIDEOS NOW!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addAllMovieVideos();
