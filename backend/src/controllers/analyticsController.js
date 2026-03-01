const pool = require('../config/database');

// Track analytics event
exports.trackEvent = async (req, res) => {
  const { entity_type, entity_id, event_type, metadata } = req.body;
  const userId = req.user?.id || null;

  try {
    await pool.query(
      `INSERT INTO analytics_events (entity_type, entity_id, event_type, user_id, metadata) 
       VALUES ($1, $2, $3, $4, $5)`,
      [entity_type, entity_id, event_type, userId, JSON.stringify(metadata || {})]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics dashboard (Pro only)
exports.getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check Pro status
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Pro subscription required' });
    }

    // Get user's profile views
    const profileViews = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events 
       WHERE entity_type = 'profile' AND entity_id = $1 AND event_type = 'view'`,
      [userId]
    );

    // Get user's content views
    const contentViews = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events 
       WHERE user_id = $1 AND event_type = 'view'`,
      [userId]
    );

    // Get ratings given
    const ratingsGiven = await pool.query(
      'SELECT COUNT(*) as count FROM ratings WHERE user_id = $1',
      [userId]
    );

    // Get reviews written
    const reviewsWritten = await pool.query(
      'SELECT COUNT(*) as count FROM reviews WHERE user_id = $1',
      [userId]
    );

    // Get watchlist count
    const watchlistCount = await pool.query(
      'SELECT COUNT(*) as count FROM watchlist WHERE user_id = $1',
      [userId]
    );

    // Get recent activity (last 30 days)
    const recentActivity = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM analytics_events 
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`,
      [userId]
    );

    res.json({
      profileViews: parseInt(profileViews.rows[0].count),
      contentViews: parseInt(contentViews.rows[0].count),
      ratingsGiven: parseInt(ratingsGiven.rows[0].count),
      reviewsWritten: parseInt(reviewsWritten.rows[0].count),
      watchlistCount: parseInt(watchlistCount.rows[0].count),
      recentActivity: recentActivity.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get celebrity analytics (Pro only)
exports.getCelebrityAnalytics = async (req, res) => {
  const { personId } = req.params;
  const userId = req.user.id;

  try {
    // Check Pro status
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Pro subscription required' });
    }

    // Get profile views
    const views = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events 
       WHERE entity_type = 'person' AND entity_id = $1 AND event_type = 'view'`,
      [personId]
    );

    // Get movies count
    const moviesCount = await pool.query(
      'SELECT COUNT(DISTINCT movie_id) as count FROM movie_cast WHERE person_id = $1',
      [personId]
    );

    // Get average rating of movies
    const avgRating = await pool.query(
      `SELECT AVG(m.rating) as avg_rating 
       FROM movies m 
       JOIN movie_cast mc ON m.id = mc.movie_id 
       WHERE mc.person_id = $1`,
      [personId]
    );

    // Get popularity trend (last 30 days)
    const trend = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as views 
       FROM analytics_events 
       WHERE entity_type = 'person' AND entity_id = $1 AND created_at > NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`,
      [personId]
    );

    res.json({
      profileViews: parseInt(views.rows[0].count),
      moviesCount: parseInt(moviesCount.rows[0].count),
      averageRating: parseFloat(avgRating.rows[0].avg_rating || 0).toFixed(1),
      popularityTrend: trend.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get movie analytics (Pro only)
exports.getMovieAnalytics = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  try {
    // Check Pro status
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Pro subscription required' });
    }

    // Get page views
    const views = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events 
       WHERE entity_type = 'movie' AND entity_id = $1 AND event_type = 'view'`,
      [movieId]
    );

    // Get ratings count
    const ratingsCount = await pool.query(
      'SELECT COUNT(*) as count FROM ratings WHERE movie_id = $1',
      [movieId]
    );

    // Get reviews count
    const reviewsCount = await pool.query(
      'SELECT COUNT(*) as count FROM reviews WHERE movie_id = $1',
      [movieId]
    );

    // Get watchlist adds
    const watchlistAdds = await pool.query(
      'SELECT COUNT(*) as count FROM watchlist WHERE movie_id = $1',
      [movieId]
    );

    // Get demographics (age groups)
    const demographics = await pool.query(
      `SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(u.date_of_birth)) < 18 THEN 'Under 18'
          WHEN EXTRACT(YEAR FROM AGE(u.date_of_birth)) BETWEEN 18 AND 24 THEN '18-24'
          WHEN EXTRACT(YEAR FROM AGE(u.date_of_birth)) BETWEEN 25 AND 34 THEN '25-34'
          WHEN EXTRACT(YEAR FROM AGE(u.date_of_birth)) BETWEEN 35 AND 44 THEN '35-44'
          ELSE '45+'
        END as age_group,
        COUNT(*) as count
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = $1 AND u.date_of_birth IS NOT NULL
       GROUP BY age_group`,
      [movieId]
    );

    res.json({
      pageViews: parseInt(views.rows[0].count),
      ratingsCount: parseInt(ratingsCount.rows[0].count),
      reviewsCount: parseInt(reviewsCount.rows[0].count),
      watchlistAdds: parseInt(watchlistAdds.rows[0].count),
      demographics: demographics.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export analytics data (Pro only)
exports.exportData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check Pro status
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Pro subscription required' });
    }

    // Get all user analytics
    const analytics = await pool.query(
      'SELECT * FROM analytics_events WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      exportDate: new Date().toISOString(),
      totalEvents: analytics.rows.length,
      data: analytics.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
