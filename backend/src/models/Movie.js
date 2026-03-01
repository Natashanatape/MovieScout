const db = require('../config/database');

class Movie {
  static async create(movieData) {
    const { title, description, release_date, runtime, poster_url, backdrop_url } = movieData;
    const result = await db.query(
      `INSERT INTO movies (title, description, release_date, runtime, poster_url, backdrop_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, release_date, runtime, poster_url, backdrop_url]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM movies WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findAll({ limit = 20, offset = 0, sortBy = 'created_at', order = 'DESC' }) {
    const result = await db.query(
      `SELECT * FROM movies ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query, limit = 20) {
    const result = await db.query(
      `SELECT * FROM movies WHERE title ILIKE $1 LIMIT $2`,
      [`%${query}%`, limit]
    );
    return result.rows;
  }

  static async updateRating(movieId) {
    const result = await db.query(
      `UPDATE movies 
       SET average_rating = (SELECT AVG(rating) FROM ratings WHERE movie_id = $1),
           rating_count = (SELECT COUNT(*) FROM ratings WHERE movie_id = $1)
       WHERE id = $1
       RETURNING average_rating, rating_count`,
      [movieId]
    );
    return result.rows[0];
  }

  static async getWithGenres(id) {
    const result = await db.query(
      `SELECT m.*, 
              COALESCE(json_agg(json_build_object('id', g.id, 'name', g.name)) 
              FILTER (WHERE g.id IS NOT NULL), '[]') as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE m.id = $1
       GROUP BY m.id`,
      [id]
    );
    return result.rows[0];
  }

  static async getCast(movieId) {
    const result = await db.query(
      `SELECT p.*, cc.role, cc.character_name, cc.department, cc."order"
       FROM cast_crew cc
       JOIN persons p ON cc.person_id = p.id
       WHERE cc.movie_id = $1
       ORDER BY cc."order"`,
      [movieId]
    );
    return result.rows;
  }

  static async getReviews(movieId, limit = 10) {
    const result = await db.query(
      `SELECT r.*, u.username 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2`,
      [movieId, limit]
    );
    return result.rows;
  }

  static async getRatingStats(movieId) {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating >= 8 THEN 1 END) as high_ratings,
        COUNT(CASE WHEN rating >= 5 AND rating < 8 THEN 1 END) as medium_ratings,
        COUNT(CASE WHEN rating < 5 THEN 1 END) as low_ratings
       FROM ratings
       WHERE movie_id = $1`,
      [movieId]
    );
    return result.rows[0];
  }

  static async getUserRating(movieId, userId) {
    const result = await db.query(
      `SELECT rating FROM ratings WHERE movie_id = $1 AND user_id = $2`,
      [movieId, userId]
    );
    return result.rows[0]?.rating || null;
  }

  static async checkWatchlist(movieId, userId) {
    const result = await db.query(
      `SELECT 1 FROM watchlist WHERE movie_id = $1 AND user_id = $2`,
      [movieId, userId]
    );
    return result.rows.length > 0;
  }

  static async findByGenre(genre, limit = 20) {
    const result = await db.query(
      `SELECT m.* FROM movies m
       JOIN movie_genres mg ON m.id = mg.movie_id
       JOIN genres g ON mg.genre_id = g.id
       WHERE g.name ILIKE $1
       ORDER BY m.average_rating DESC
       LIMIT $2`,
      [genre, limit]
    );
    return result.rows;
  }

  static async findPopularByTimeframe(limit = 10, orderBy = 'average_rating DESC') {
    const query = `
      SELECT * FROM movies 
      ORDER BY ${orderBy}
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Movie;
