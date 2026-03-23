const db = require('../config/database');

class RecommendationController {
  static async getSimilarMovies(req, res) {
    try {
      const { movieId } = req.params;
      const limit = parseInt(req.query.limit) || 8;

      // Get current movie details
      const movieResult = await db.query(
        `SELECT m.*, array_agg(DISTINCT g.name) as genres
         FROM movies m
         LEFT JOIN movie_genres mg ON m.id = mg.movie_id
         LEFT JOIN genres g ON mg.genre_id = g.id
         WHERE m.id = $1
         GROUP BY m.id`,
        [movieId]
      );

      if (movieResult.rows.length === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const movie = movieResult.rows[0];

      // Find similar movies based on genres
      const similarResult = await db.query(
        `SELECT DISTINCT m.*, 
                array_agg(DISTINCT g.name) as genres,
                COUNT(DISTINCT mg.genre_id) as matching_genres
         FROM movies m
         LEFT JOIN movie_genres mg ON m.id = mg.movie_id
         LEFT JOIN genres g ON mg.genre_id = g.id
         WHERE m.id != $1
         AND mg.genre_id IN (
           SELECT genre_id FROM movie_genres WHERE movie_id = $1
         )
         GROUP BY m.id
         ORDER BY matching_genres DESC, m.average_rating DESC
         LIMIT $2`,
        [movieId, limit]
      );

      res.json({ similar: similarResult.rows });
    } catch (error) {
      console.error('Get similar movies error:', error);
      res.status(500).json({ error: 'Failed to get similar movies' });
    }
  }

  static async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      // Get user's top-rated genres
      const result = await db.query(
        `SELECT m.*, array_agg(DISTINCT g.name) as genres
         FROM movies m
         LEFT JOIN movie_genres mg ON m.id = mg.movie_id
         LEFT JOIN genres g ON mg.genre_id = g.id
         WHERE mg.genre_id IN (
           SELECT mg2.genre_id
           FROM ratings r
           JOIN movie_genres mg2 ON r.movie_id = mg2.movie_id
           WHERE r.user_id = $1 AND r.rating >= 7
           GROUP BY mg2.genre_id
           ORDER BY COUNT(*) DESC
           LIMIT 3
         )
         AND m.id NOT IN (
           SELECT movie_id FROM ratings WHERE user_id = $1
         )
         GROUP BY m.id
         ORDER BY m.average_rating DESC
         LIMIT $2`,
        [userId, limit]
      );

      res.json({ recommendations: result.rows });
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
}

module.exports = RecommendationController;
