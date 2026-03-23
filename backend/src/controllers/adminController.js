const db = require('../config/database');
const bcrypt = require('bcryptjs');

class AdminController {
  // Dashboard Stats
  static async getDashboardStats(req, res) {
    try {
      const stats = await Promise.all([
        // Total users
        db.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user']),
        // Total movies
        db.query('SELECT COUNT(*) as count FROM movies'),
        // Total reviews
        db.query('SELECT COUNT(*) as count FROM reviews'),
        // Total ratings
        db.query('SELECT COUNT(*) as count FROM ratings'),
        // New users this month
        db.query(`SELECT COUNT(*) as count FROM users 
                  WHERE created_at >= date_trunc('month', CURRENT_DATE) 
                  AND role = $1`, ['user']),
        // Popular movies (top 5)
        db.query(`SELECT m.title, AVG(r.rating) as avg_rating, COUNT(r.id) as rating_count
                  FROM movies m 
                  LEFT JOIN ratings r ON m.id = r.movie_id 
                  GROUP BY m.id, m.title 
                  ORDER BY rating_count DESC, avg_rating DESC 
                  LIMIT 5`),
        // Recent activity
        db.query(`SELECT 'review' as type, u.username, m.title, r.created_at
                  FROM reviews r 
                  JOIN users u ON r.user_id = u.id 
                  JOIN movies m ON r.movie_id = m.id 
                  ORDER BY r.created_at DESC LIMIT 10`)
      ]);

      res.json({
        totalUsers: parseInt(stats[0].rows[0].count),
        totalMovies: parseInt(stats[1].rows[0].count),
        totalReviews: parseInt(stats[2].rows[0].count),
        totalRatings: parseInt(stats[3].rows[0].count),
        newUsersThisMonth: parseInt(stats[4].rows[0].count),
        popularMovies: stats[5].rows,
        recentActivity: stats[6].rows
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
  }

  // User Management
  static async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';

      let query = `
        SELECT u.id, u.username, u.email, u.role, u.created_at,
               up.display_name, up.profile_image_url,
               COUNT(DISTINCT r.id) as reviews_count,
               COUNT(DISTINCT rt.id) as ratings_count
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN reviews r ON u.id = r.user_id
        LEFT JOIN ratings rt ON u.id = rt.user_id
      `;

      const params = [];
      if (search) {
        query += ` WHERE u.username ILIKE $1 OR u.email ILIKE $1`;
        params.push(`%${search}%`);
      }

      query += ` GROUP BY u.id, up.display_name, up.profile_image_url
                 ORDER BY u.created_at DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      
      params.push(limit, offset);

      const result = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM users';
      const countParams = [];
      if (search) {
        countQuery += ' WHERE username ILIKE $1 OR email ILIKE $1';
        countParams.push(`%${search}%`);
      }
      
      const countResult = await db.query(countQuery, countParams);
      const totalUsers = parseInt(countResult.rows[0].count);

      res.json({
        users: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  }

  static async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'admin', 'moderator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
      
      // Log admin action
      await AdminController.logAdminAction(req.user.id, 'update_user_role', 'user', userId, {
        new_role: role
      }, req.ip);

      res.json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      // Get user info before deletion
      const userResult = await db.query('SELECT username, email FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete user (cascade will handle related data)
      await db.query('DELETE FROM users WHERE id = $1', [userId]);
      
      // Log admin action
      await AdminController.logAdminAction(req.user.id, 'delete_user', 'user', userId, {
        deleted_user: userResult.rows[0]
      }, req.ip);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  // Movie Management
  static async getAllMovies(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';

      let query = `
        SELECT m.*, 
               AVG(r.rating) as avg_rating,
               COUNT(DISTINCT r.id) as rating_count,
               COUNT(DISTINCT rev.id) as review_count
        FROM movies m
        LEFT JOIN ratings r ON m.id = r.movie_id
        LEFT JOIN reviews rev ON m.id = rev.movie_id
      `;

      const params = [];
      if (search) {
        query += ` WHERE m.title ILIKE $1`;
        params.push(`%${search}%`);
      }

      query += ` GROUP BY m.id
                 ORDER BY m.created_at DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      
      params.push(limit, offset);

      const result = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM movies';
      const countParams = [];
      if (search) {
        countQuery += ' WHERE title ILIKE $1';
        countParams.push(`%${search}%`);
      }
      
      const countResult = await db.query(countQuery, countParams);
      const totalMovies = parseInt(countResult.rows[0].count);

      res.json({
        movies: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMovies / limit),
          totalMovies,
          hasNext: page * limit < totalMovies,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Get movies error:', error);
      res.status(500).json({ error: 'Failed to get movies' });
    }
  }

  static async deleteMovie(req, res) {
    try {
      const { movieId } = req.params;

      // Get movie info before deletion
      const movieResult = await db.query('SELECT title FROM movies WHERE id = $1', [movieId]);
      
      if (movieResult.rows.length === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      // Delete movie (cascade will handle related data)
      await db.query('DELETE FROM movies WHERE id = $1', [movieId]);
      
      // Log admin action
      await AdminController.logAdminAction(req.user.id, 'delete_movie', 'movie', movieId, {
        deleted_movie: movieResult.rows[0]
      }, req.ip);

      res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
      console.error('Delete movie error:', error);
      res.status(500).json({ error: 'Failed to delete movie' });
    }
  }

  // Review Management
  static async getAllReviews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const result = await db.query(`
        SELECT r.*, u.username, m.title as movie_title,
               COUNT(c.id) as comment_count
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN movies m ON r.movie_id = m.id
        LEFT JOIN comments c ON r.id = c.review_id
        GROUP BY r.id, u.username, m.title
        ORDER BY r.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      const countResult = await db.query('SELECT COUNT(*) FROM reviews');
      const totalReviews = parseInt(countResult.rows[0].count);

      res.json({
        reviews: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: page * limit < totalReviews,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Failed to get reviews' });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;

      // Get review info before deletion
      const reviewResult = await db.query(`
        SELECT r.review_text, u.username, m.title 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        JOIN movies m ON r.movie_id = m.id 
        WHERE r.id = $1
      `, [reviewId]);
      
      if (reviewResult.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Delete review (cascade will handle comments)
      await db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
      
      // Log admin action
      await AdminController.logAdminAction(req.user.id, 'delete_review', 'review', reviewId, {
        deleted_review: reviewResult.rows[0]
      }, req.ip);

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }

  // Settings Management
  static async getSettings(req, res) {
    try {
      const result = await db.query('SELECT * FROM admin_settings ORDER BY setting_key');
      res.json({ settings: result.rows });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Failed to get settings' });
    }
  }

  static async updateSetting(req, res) {
    try {
      const { key, value } = req.body;

      await db.query(`
        UPDATE admin_settings 
        SET setting_value = $1, updated_by = $2, updated_at = NOW() 
        WHERE setting_key = $3
      `, [value, req.user.id, key]);

      // Log admin action
      await AdminController.logAdminAction(req.user.id, 'update_setting', 'setting', null, {
        setting_key: key,
        new_value: value
      }, req.ip);

      res.json({ message: 'Setting updated successfully' });
    } catch (error) {
      console.error('Update setting error:', error);
      res.status(500).json({ error: 'Failed to update setting' });
    }
  }

  // Admin Logs
  static async getAdminLogs(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const result = await db.query(`
        SELECT al.*, u.username as admin_username
        FROM admin_logs al
        JOIN users u ON al.admin_id = u.id
        ORDER BY al.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      const countResult = await db.query('SELECT COUNT(*) FROM admin_logs');
      const totalLogs = parseInt(countResult.rows[0].count);

      res.json({
        logs: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLogs / limit),
          totalLogs,
          hasNext: page * limit < totalLogs,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Get admin logs error:', error);
      res.status(500).json({ error: 'Failed to get admin logs' });
    }
  }

  // Helper method to log admin actions
  static async logAdminAction(adminId, action, targetType, targetId, details, ipAddress) {
    try {
      await db.query(`
        INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [adminId, action, targetType, targetId, JSON.stringify(details), ipAddress]);
    } catch (error) {
      console.error('Log admin action error:', error);
    }
  }

  // Analytics
  static async getAnalytics(req, res) {
    try {
      const { period = '30' } = req.query; // days

      const analytics = await Promise.all([
        // User registrations over time
        db.query(`
          SELECT DATE(created_at) as date, COUNT(*) as count
          FROM users 
          WHERE created_at >= NOW() - INTERVAL '${period} days'
          AND role = 'user'
          GROUP BY DATE(created_at)
          ORDER BY date
        `),
        // Reviews over time
        db.query(`
          SELECT DATE(created_at) as date, COUNT(*) as count
          FROM reviews 
          WHERE created_at >= NOW() - INTERVAL '${period} days'
          GROUP BY DATE(created_at)
          ORDER BY date
        `),
        // Top rated movies
        db.query(`
          SELECT m.title, AVG(r.rating) as avg_rating, COUNT(r.id) as rating_count
          FROM movies m
          JOIN ratings r ON m.id = r.movie_id
          GROUP BY m.id, m.title
          HAVING COUNT(r.id) >= 5
          ORDER BY avg_rating DESC, rating_count DESC
          LIMIT 10
        `),
        // Most active users
        db.query(`
          SELECT u.username, 
                 COUNT(DISTINCT r.id) as review_count,
                 COUNT(DISTINCT rt.id) as rating_count,
                 (COUNT(DISTINCT r.id) + COUNT(DISTINCT rt.id)) as total_activity
          FROM users u
          LEFT JOIN reviews r ON u.id = r.user_id
          LEFT JOIN ratings rt ON u.id = rt.user_id
          WHERE u.role = 'user'
          GROUP BY u.id, u.username
          ORDER BY total_activity DESC
          LIMIT 10
        `)
      ]);

      res.json({
        userRegistrations: analytics[0].rows,
        reviewsOverTime: analytics[1].rows,
        topRatedMovies: analytics[2].rows,
        mostActiveUsers: analytics[3].rows
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  }
}

module.exports = AdminController;