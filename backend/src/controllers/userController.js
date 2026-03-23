const db = require('../config/database');
const Joi = require('joi');

const updateProfileSchema = Joi.object({
  display_name: Joi.string().min(2).max(50),
  bio: Joi.string().max(500).allow(''),
  location: Joi.string().max(100).allow(''),
  website: Joi.string().uri().allow(''),
});

class UserController {
  static async getProfile(req, res) {
    try {
      const userId = req.params.id || req.user.id;
      
      const result = await db.query(
        `SELECT u.id, u.username, u.email, u.created_at,
                up.display_name, up.bio, up.profile_image_url, up.location, up.website,
                COUNT(DISTINCT r.id) as ratings_count,
                COUNT(DISTINCT rev.id) as reviews_count,
                COUNT(DISTINCT w.id) as watchlist_count
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         LEFT JOIN ratings r ON u.id = r.user_id
         LEFT JOIN reviews rev ON u.id = rev.user_id
         LEFT JOIN watchlist w ON u.id = w.user_id
         WHERE u.id = $1
         GROUP BY u.id, up.display_name, up.bio, up.profile_image_url, up.location, up.website`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ profile: result.rows[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { error } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { display_name, bio, location, website } = req.body;
      const userId = req.user.id;

      const result = await db.query(
        `INSERT INTO user_profiles (user_id, display_name, bio, location, website)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) 
         DO UPDATE SET 
           display_name = EXCLUDED.display_name,
           bio = EXCLUDED.bio,
           location = EXCLUDED.location,
           website = EXCLUDED.website,
           updated_at = NOW()
         RETURNING *`,
        [userId, display_name, bio, location, website]
      );

      res.json({ 
        message: 'Profile updated successfully',
        profile: result.rows[0] 
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async uploadProfileImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const imageUrl = `/uploads/profiles/${req.file.filename}`;
      const userId = req.user.id;

      await db.query(
        `INSERT INTO user_profiles (user_id, profile_image_url)
         VALUES ($1, $2)
         ON CONFLICT (user_id) 
         DO UPDATE SET profile_image_url = EXCLUDED.profile_image_url, updated_at = NOW()`,
        [userId, imageUrl]
      );

      res.json({ 
        message: 'Profile image uploaded successfully',
        imageUrl 
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  static async getUserRatings(req, res) {
    try {
      const userId = req.params.id || req.user.id;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      const result = await db.query(
        `SELECT r.*, m.title, m.poster_url, m.release_date
         FROM ratings r
         JOIN movies m ON r.movie_id = m.id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      res.json({ ratings: result.rows });
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ error: 'Failed to get ratings' });
    }
  }

  static async getUserReviews(req, res) {
    try {
      const userId = req.params.id || req.user.id;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      const result = await db.query(
        `SELECT rev.*, m.title, m.poster_url
         FROM reviews rev
         JOIN movies m ON rev.movie_id = m.id
         WHERE rev.user_id = $1
         ORDER BY rev.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      res.json({ reviews: result.rows });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Failed to get reviews' });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both passwords required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const user = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      const bcrypt = require('bcryptjs');
      
      const isValid = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, req.user.id]);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
}

module.exports = UserController;
