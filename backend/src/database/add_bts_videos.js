const db = require('../config/database');

const addBTSVideos = async () => {
  try {
    const videos = [
      // The Dark Knight BTS
      { movie_id: 3, title: 'The Dark Knight - Behind the Scenes: Joker Makeup', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', duration: 420, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 3, title: 'The Dark Knight - Making of the Batpod', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', duration: 360, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 3, title: 'The Dark Knight - IMAX Filming', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', duration: 480, quality: '1080p', source: 'youtube', is_featured: false },
      
      // Inception BTS
      { movie_id: 5, title: 'Inception - Dream Within a Dream', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', duration: 540, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 5, title: 'Inception - Rotating Hallway Scene', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', duration: 600, quality: '1080p', source: 'youtube', is_featured: true },
      { movie_id: 5, title: 'Inception - Practical Effects', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', duration: 420, quality: '1080p', source: 'youtube', is_featured: false },
      
      // The Matrix BTS
      { movie_id: 8, title: 'The Matrix - Bullet Time Effect', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', duration: 300, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 8, title: 'The Matrix - Fight Choreography', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', duration: 420, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 8, title: 'The Matrix - Wire Work Training', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', duration: 360, quality: '1080p', source: 'youtube', is_featured: false },
      
      // Pulp Fiction BTS
      { movie_id: 4, title: 'Pulp Fiction - Tarantino on Set', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', duration: 480, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 4, title: 'Pulp Fiction - Dance Scene Rehearsal', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', duration: 240, quality: '1080p', source: 'youtube', is_featured: false },
      
      // The Godfather BTS
      { movie_id: 2, title: 'The Godfather - Marlon Brando Makeup', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', duration: 300, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 2, title: 'The Godfather - Filming the Wedding Scene', video_type: 'behind_scenes', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', duration: 540, quality: '1080p', source: 'youtube', is_featured: false },
    ];

    for (const video of videos) {
      await db.query(
        `INSERT INTO videos (movie_id, title, video_type, video_url, thumbnail_url, duration, quality, source, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [video.movie_id, video.title, video.video_type, video.video_url, video.thumbnail_url, video.duration, video.quality, video.source, video.is_featured]
      );
    }

    console.log('✅ Behind the Scenes videos added successfully!');
  } catch (error) {
    console.error('❌ Error adding BTS videos:', error);
    throw error;
  }
};

addBTSVideos()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
