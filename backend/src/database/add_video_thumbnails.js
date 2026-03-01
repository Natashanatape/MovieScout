const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const videoThumbnails = [
  { id: 1, thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=350&fit=crop' },
  { id: 2, thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=350&fit=crop' },
  { id: 3, thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=350&fit=crop' },
  { id: 4, thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=350&fit=crop' },
  { id: 5, thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=350&fit=crop' },
  { id: 6, thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=350&fit=crop' },
  { id: 7, thumbnail: 'https://images.unsplash.com/photo-1574267432644-f610a5c0c5e0?w=500&h=350&fit=crop' },
  { id: 8, thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&h=350&fit=crop' },
];

async function updateThumbnails() {
  try {
    for (const video of videoThumbnails) {
      await pool.query(
        'UPDATE videos SET thumbnail_url = $1 WHERE id = $2',
        [video.thumbnail, video.id]
      );
      console.log(`✅ Updated video ${video.id}`);
    }
    console.log('✅ All video thumbnails updated!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateThumbnails();
