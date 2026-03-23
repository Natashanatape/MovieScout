const db = require('../config/database');

class Review {
  static async create({ user_id, movie_id, review_text, rating }) {
    const result = await db.query(
      `INSERT INTO reviews (user_id, movie_id, review_text, rating) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, movie_id, review_text, rating]
    );
    return result.rows[0];
  }

  static async findByMovieId(movie_id, { limit = 10, offset = 0 }) {
    const result = await db.query(
      `SELECT r.*, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = $1
       ORDER BY r.helpful_count DESC, r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [movie_id, limit, offset]
    );
    return result.rows;
  }

  static async findByUserId(user_id) {
    const result = await db.query(
      `SELECT r.*, m.title, m.poster_url
       FROM reviews r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [user_id]
    );
    return result.rows;
  }

  static async update(id, user_id, { review_text, rating }) {
    const result = await db.query(
      `UPDATE reviews 
       SET review_text = $1, rating = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [review_text, rating, id, user_id]
    );
    return result.rows[0];
  }

  static async delete(id, user_id) {
    const result = await db.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );
    return result.rows[0];
  }

  static async voteHelpful(review_id, user_id, vote_type) {
    await db.query(
      `INSERT INTO review_votes (user_id, review_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, review_id) 
       DO UPDATE SET vote_type = $3`,
      [user_id, review_id, vote_type]
    );

    const count = await db.query(
      `SELECT COUNT(*) as count FROM review_votes 
       WHERE review_id = $1 AND vote_type = 'helpful'`,
      [review_id]
    );

    await db.query(
      'UPDATE reviews SET helpful_count = $1 WHERE id = $2',
      [count.rows[0].count, review_id]
    );
  }
}

module.exports = Review;
