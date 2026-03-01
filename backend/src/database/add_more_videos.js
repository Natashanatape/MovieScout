const db = require('../config/database');

const addMoreVideos = async () => {
  try {
    const videos = [
      // More Trailers
      { movie_id: 4, title: 'Pulp Fiction - Official Trailer', video_type: 'trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', duration: 145, quality: '1080p', source: 'youtube', is_featured: true },
      { movie_id: 7, title: 'Forrest Gump - Official Trailer', video_type: 'trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', duration: 150, quality: '1080p', source: 'youtube', is_featured: true },
      { movie_id: 6, title: 'Fight Club - Official Trailer', video_type: 'trailer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', duration: 140, quality: '1080p', source: 'youtube', is_featured: true },
      
      // More Interviews
      { movie_id: 5, title: 'Leonardo DiCaprio Interview - Inception', video_type: 'interview', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', duration: 420, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 8, title: 'Keanu Reeves Interview - The Matrix', video_type: 'interview', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', duration: 380, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 4, title: 'Quentin Tarantino Interview - Pulp Fiction', video_type: 'interview', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', duration: 450, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 7, title: 'Tom Hanks Interview - Forrest Gump', video_type: 'interview', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', duration: 400, quality: '1080p', source: 'youtube', is_featured: false },
      
      // More Clips
      { movie_id: 5, title: 'Inception - Dream Kick Scene', video_type: 'clip', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', duration: 200, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 8, title: 'The Matrix - Lobby Scene', video_type: 'clip', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', duration: 220, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 4, title: 'Pulp Fiction - Ezekiel 25:17', video_type: 'clip', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', duration: 180, quality: '1080p', source: 'youtube', is_featured: false },
      { movie_id: 7, title: 'Forrest Gump - Run Forrest Run', video_type: 'clip', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', duration: 160, quality: '1080p', source: 'youtube', is_featured: false },
    ];

    for (const video of videos) {
      await db.query(
        `INSERT INTO videos (movie_id, title, video_type, video_url, thumbnail_url, duration, quality, source, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [video.movie_id, video.title, video.video_type, video.video_url, video.thumbnail_url, video.duration, video.quality, video.source, video.is_featured]
      );
    }

    console.log('✅ More videos added successfully!');
  } catch (error) {
    console.error('❌ Error adding videos:', error);
    throw error;
  }
};

addMoreVideos()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
