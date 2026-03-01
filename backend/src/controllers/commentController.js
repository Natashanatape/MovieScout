const pool = require('../config/database');

// Create Comment
exports.createComment = async (req, res) => {
  try {
    const { review_id, comment_text, parent_comment_id } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO comments (review_id, user_id, comment_text, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [review_id, user_id, comment_text, parent_comment_id || null]
    );

    const comment = await pool.query(
      `SELECT c.*, u.username, u.profile_picture 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(comment.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Review Comments
exports.getReviewComments = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await pool.query(
      `SELECT c.*, u.username, u.profile_picture 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.review_id = $1 
       ORDER BY c.created_at DESC`,
      [reviewId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment_text } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'UPDATE comments SET comment_text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [comment_text, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vote on Comment
exports.voteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    
    const field = vote === 'up' ? 'upvotes' : 'downvotes';
    const result = await pool.query(
      `UPDATE comments SET ${field} = ${field} + 1 WHERE id = $1 RETURNING *`,
      [id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
