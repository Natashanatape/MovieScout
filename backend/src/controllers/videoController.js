const pool = require('../config/database');

// Get featured videos
exports.getFeatured = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const result = await pool.query(
      `SELECT v.*, m.title as movie_title 
       FROM videos v 
       LEFT JOIN movies m ON v.movie_id = m.id 
       ORDER BY v.views_count DESC, v.created_at DESC 
       LIMIT $1`,
      [parseInt(limit)]
    );
    res.json(result.rows);
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
    
    const result = await pool.query(
      'SELECT * FROM videos WHERE movie_id = $1 ORDER BY created_at DESC',
      [movieId]
    );
    
    res.json(result.rows);
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
