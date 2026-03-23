const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, username }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
      [email, hashedPassword, username]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT id, email, username, role, is_verified, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateVerificationStatus(id) {
    await db.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1', [id]);
  }

  static async setResetToken(email, token, expiry) {
    await db.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [token, expiry, email]
    );
  }

  static async resetPassword(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2 AND reset_token_expiry > NOW() RETURNING id',
      [hashedPassword, token]
    );
    return result.rows[0];
  }

  static async saveResetToken(userId, token, expiry) {
    await db.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [token, expiry, userId]
    );
  }

  static async findByResetToken(token) {
    const result = await db.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [token]
    );
    return result.rows[0];
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, userId]
    );
  }

  static async clearResetToken(userId) {
    await db.query(
      'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1',
      [userId]
    );
  }
}

module.exports = User;
