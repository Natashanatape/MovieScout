const db = require('../config/database');

const fixBTSVideos = async () => {
  try {
    // Delete all BTS videos first
    await db.query(`DELETE FROM videos WHERE video_type = 'behind_scenes'`);
    console.log('✅ Deleted old BTS videos');

    // Add unique BTS videos
    const btsVideos = [
      { movie_id: 3, title: 'The Dark Knight - Joker Makeup Behind the Scenes', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', duration: 420, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 5, title: 'Inception - Rotating Hallway Behind the Scenes', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', duration: 600, quality: '1080p', source: 'youtube', is_featured: true },
      { movie_id: 8, title: 'The Matrix - Bullet Time Effect Behind the Scenes', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', duration: 300, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 4, title: 'Pulp Fiction - Dance Scene Rehearsal', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', duration: 240, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 2, title: 'The Godfather - Wedding Scene Behind the Scenes', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', duration: 540, quality: '1080p', source: 'youtube', is_featured: false },
    ];

    for (const video of btsVideos) {
      await db.query(
        `INSERT INTO videos (movie_id, title, video_type, video_url, thumbnail_url, duration, quality, source, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [video.movie_id, video.title, video.video_type, video.video_url, video.thumbnail_url, video.duration, video.quality, video.source, video.is_featured]
      );
    }

    console.log('✅ Added 5 unique BTS videos!');
  } catch (error) {
    console.error('❌ Error fixing BTS videos:', error);
    throw error;
  }
};

fixBTSVideos()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
