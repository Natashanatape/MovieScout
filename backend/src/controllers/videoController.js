const pool = require('../config/database');

// Get featured videos
exports.getFeatured = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    
    try {
      const result = await pool.query(
        `SELECT v.*, m.title as movie_title 
         FROM videos v 
         LEFT JOIN movies m ON v.movie_id = m.id 
         ORDER BY v.views_count DESC, v.created_at DESC 
         LIMIT $1`,
        [parseInt(limit)]
      );
      
      if (result.rows && result.rows.length > 0) {
        return res.json(result.rows);
      }
    } catch (dbError) {
      console.log('Database error, returning sample videos:', dbError.message);
    }
    
    // Sample featured videos
    const sampleVideos = [
      { id: 1, movie_id: 1, title: 'The Shawshank Redemption - Official Trailer', video_url: 'https://www.youtube.com/embed/6hB3S9bIaco', video_type: 'trailer', duration: 150, quality: '1080p', views_count: 2500000, movie_title: 'The Shawshank Redemption' },
      { id: 2, movie_id: 2, title: 'The Godfather - Trailer', video_url: 'https://www.youtube.com/embed/sY1S34973zA', video_type: 'trailer', duration: 180, quality: '1080p', views_count: 1800000, movie_title: 'The Godfather' },
      { id: 3, movie_id: 3, title: 'The Dark Knight - Official Trailer', video_url: 'https://www.youtube.com/embed/EXeTwQWrcwY', video_type: 'trailer', duration: 160, quality: '1080p', views_count: 2600000, movie_title: 'The Dark Knight' },
      { id: 4, movie_id: 4, title: 'Pulp Fiction - Trailer', video_url: 'https://www.youtube.com/embed/s7EdQ4FqbhY', video_type: 'trailer', duration: 140, quality: '1080p', views_count: 2000000, movie_title: 'Pulp Fiction' }
    ];
    
    res.json(sampleVideos.slice(0, parseInt(limit)));
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest videos
exports.getLatest = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const result = await pool.query(
      `SELECT v.*, m.title as movie_title 
       FROM videos v 
       LEFT JOIN movies m ON v.movie_id = m.id 
       ORDER BY v.created_at DESC 
       LIMIT $1`,
      [parseInt(limit)]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get videos by type
exports.getByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 12 } = req.query;
    const result = await pool.query(
      `SELECT v.*, m.title as movie_title 
       FROM videos v 
       LEFT JOIN movies m ON v.movie_id = m.id 
       WHERE v.video_type = $1 
       ORDER BY v.views_count DESC, v.created_at DESC 
       LIMIT $2`,
      [type, parseInt(limit)]
    );
    res.json({ videos: result.rows });
  } catch (error) {
    console.error('Error fetching videos by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search videos
exports.search = async (req, res) => {
  try {
    const { q, limit = 12 } = req.query;
    const result = await pool.query(
      `SELECT v.*, m.title as movie_title 
       FROM videos v 
       LEFT JOIN movies m ON v.movie_id = m.id 
       WHERE v.title ILIKE $1 OR m.title ILIKE $1 
       ORDER BY v.views_count DESC 
       LIMIT $2`,
      [`%${q}%`, parseInt(limit)]
    );
    res.json({ videos: result.rows });
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get videos for a movie
exports.getMovieVideos = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    try {
      const result = await pool.query(
        'SELECT * FROM videos WHERE movie_id = $1 ORDER BY created_at DESC',
        [movieId]
      );
      
      if (result.rows && result.rows.length > 0) {
        return res.json(result.rows);
      }
    } catch (dbError) {
      console.log('Database error, returning sample movie videos:', dbError.message);
    }
    
    // Sample movie videos based on movieId
    const movieVideos = {
      1: [{ id: 1, movie_id: 1, title: 'The Shawshank Redemption - Official Trailer', video_url: 'https://www.youtube.com/embed/6hB3S9bIaco', video_type: 'trailer', duration: 150, quality: '1080p', views_count: 2500000 }],
      2: [{ id: 2, movie_id: 2, title: 'The Godfather - Trailer', video_url: 'https://www.youtube.com/embed/sY1S34973zA', video_type: 'trailer', duration: 180, quality: '1080p', views_count: 1800000 }],
      3: [{ id: 3, movie_id: 3, title: 'The Dark Knight - Official Trailer', video_url: 'https://www.youtube.com/embed/EXeTwQWrcwY', video_type: 'trailer', duration: 160, quality: '1080p', views_count: 2600000 }],
      4: [{ id: 4, movie_id: 4, title: 'Pulp Fiction - Trailer', video_url: 'https://www.youtube.com/embed/s7EdQ4FqbhY', video_type: 'trailer', duration: 140, quality: '1080p', views_count: 2000000 }]
    };
    
    res.json(movieVideos[movieId] || []);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single video
exports.getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM videos WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add video (admin only)
exports.addVideo = async (req, res) => {
  try {
    const { movie_id, title, video_url, video_type, duration, quality } = req.body;
    
    const result = await pool.query(
      'INSERT INTO videos (movie_id, title, video_url, video_type, duration, quality) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [movie_id, title, video_url, video_type, duration, quality]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track video view
exports.trackView = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id || null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const { watchDuration } = req.body;

    // Check if already viewed (unique view per user/IP in last 24 hours)
    const checkQuery = userId 
      ? 'SELECT id FROM video_views WHERE video_id = $1 AND user_id = $2 AND viewed_at > NOW() - INTERVAL \'24 hours\''
      : 'SELECT id FROM video_views WHERE video_id = $1 AND ip_address = $2 AND viewed_at > NOW() - INTERVAL \'24 hours\'';
    
    const checkParams = userId ? [videoId, userId] : [videoId, ipAddress];
    const existing = await pool.query(checkQuery, checkParams);

    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO video_views (video_id, user_id, ip_address, watch_duration) VALUES ($1, $2, $3, $4)',
        [videoId, userId, ipAddress, watchDuration || 0]
      );
    }

    // Get updated views count
    const result = await pool.query(
      'SELECT views_count FROM videos WHERE id = $1',
      [videoId]
    );

    res.json({ views: result.rows[0]?.views_count || 0 });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get video views count
exports.getViewsCount = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const result = await pool.query(
      'SELECT views_count FROM videos WHERE id = $1',
      [videoId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json({ views: result.rows[0].views_count || 0 });
  } catch (error) {
    console.error('Error fetching views:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;
