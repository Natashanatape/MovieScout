const pool = require('../config/database');

// Follow User
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const follower_id = req.user.id;

    if (follower_id == userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const result = await pool.query(
      'INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [follower_id, userId]
    );

    // Create notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, title, message, link) VALUES ($1, $2, $3, $4, $5)',
      [userId, 'follow', 'New Follower', `${req.user.username} started following you`, `/profile/${follower_id}`]
    );

    res.status(201).json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unfollow User
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const follower_id = req.user.id;

    await pool.query(
      'DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2',
      [follower_id, userId]
    );

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Followers
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.username, u.profile_picture, uf.created_at 
       FROM user_follows uf 
       JOIN users u ON uf.follower_id = u.id 
       WHERE uf.following_id = $1 
       ORDER BY uf.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.username, u.profile_picture, uf.created_at 
       FROM user_follows uf 
       JOIN users u ON uf.following_id = u.id 
       WHERE uf.follower_id = $1 
       ORDER BY uf.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if Following
exports.checkFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const follower_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM user_follows WHERE follower_id = $1 AND following_id = $2',
      [follower_id, userId]
    );

    res.json({ isFollowing: result.rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Activity Feed
exports.getActivityFeed = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        af.activity_type as type,
        af.created_at,
        u.id as user_id,
        u.username,
        u.profile_picture,
        m.id as movie_id,
        m.title,
        r.rating
       FROM activity_feed af
       JOIN users u ON af.user_id = u.id
       LEFT JOIN movies m ON af.target_id = m.id AND af.target_type = 'movie'
       LEFT JOIN ratings r ON r.user_id = af.user_id AND r.movie_id = af.target_id AND af.activity_type = 'rating'
       WHERE af.user_id IN (SELECT following_id FROM user_follows WHERE follower_id = $1)
       ORDER BY af.created_at DESC
       LIMIT 50`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Follow Stats
exports.getFollowStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const followers = await pool.query(
      'SELECT COUNT(*) FROM user_follows WHERE following_id = $1',
      [userId]
    );
    
    const following = await pool.query(
      'SELECT COUNT(*) FROM user_follows WHERE follower_id = $1',
      [userId]
    );

    res.json({
      followers: parseInt(followers.rows[0].count),
      following: parseInt(following.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
