const db = require('../config/database');
const Movie = require('../models/Movie');
const redisClient = require('../config/redis');

class RatingController {
  static async create(req, res) {
    try {
      const { movie_id, rating } = req.body;
      const user_id = req.user.id;

      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'Rating must be between 1 and 10' });
      }

      const result = await db.query(
        `INSERT INTO ratings (user_id, movie_id, rating) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (user_id, movie_id) 
         DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [user_id, movie_id, rating]
      );

      await Movie.updateRating(movie_id);
      await redisClient.del(`movie:${movie_id}`);

      res.json({
        message: 'Rating saved successfully',
        rating: result.rows[0],
      });
    } catch (error) {
      console.error('Rating error:', error);
      res.status(500).json({ error: 'Failed to save rating' });
    }
  }

  static async getUserRating(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.user.id;

      const result = await db.query(
        'SELECT * FROM ratings WHERE user_id = $1 AND movie_id = $2',
        [user_id, movie_id]
      );

      res.json(result.rows[0] || null);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rating' });
    }
  }
}

module.exports = RatingController;
