const db = require('../config/database');

class Watchlist {
  static async add(user_id, movie_id) {
    const result = await db.query(
      `INSERT INTO watchlist (user_id, movie_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, movie_id) DO NOTHING
       RETURNING *`,
      [user_id, movie_id]
    );
    return result.rows[0];
  }

  static async remove(user_id, movie_id) {
    const result = await db.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2 RETURNING id',
      [user_id, movie_id]
    );
    return result.rows[0];
  }

  static async getByUserId(user_id) {
    const result = await db.query(
      `SELECT w.*, m.title, m.poster_url, m.release_date, m.average_rating
       FROM watchlist w
       JOIN movies m ON w.movie_id = m.id
       WHERE w.user_id = $1
       ORDER BY w.added_at DESC`,
      [user_id]
    );
    return result.rows;
  }

  static async isInWatchlist(user_id, movie_id) {
    const result = await db.query(
      'SELECT id FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [user_id, movie_id]
    );
    return result.rows.length > 0;
  }
}

module.exports = Watchlist;
