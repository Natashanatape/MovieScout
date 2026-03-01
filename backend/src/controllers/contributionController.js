const pool = require('../config/database');

// Submit Trivia
exports.submitTrivia = async (req, res) => {
  try {
    const { movie_id, trivia_text } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO trivia (movie_id, user_id, trivia_text) VALUES ($1, $2, $3) RETURNING *',
      [movie_id, user_id, trivia_text]
    );

    await pool.query(
      'INSERT INTO user_reputation (user_id, contributions_count) VALUES ($1, 1) ON CONFLICT (user_id) DO UPDATE SET contributions_count = user_reputation.contributions_count + 1',
      [user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Movie Trivia
exports.getMovieTrivia = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await pool.query(
      `SELECT t.*, u.username, u.profile_picture 
       FROM trivia t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.movie_id = $1 AND t.status = 'approved' 
       ORDER BY t.upvotes DESC`,
      [movieId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vote on Trivia
exports.voteTrivia = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'
    
    const field = vote === 'up' ? 'upvotes' : 'downvotes';
    const result = await pool.query(
      `UPDATE trivia SET ${field} = ${field} + 1 WHERE id = $1 RETURNING *`,
      [id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Goof
exports.submitGoof = async (req, res) => {
  try {
    const { movie_id, goof_text, goof_type } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO goofs (movie_id, user_id, goof_text, goof_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [movie_id, user_id, goof_text, goof_type]
    );

    await pool.query(
      'INSERT INTO user_reputation (user_id, contributions_count) VALUES ($1, 1) ON CONFLICT (user_id) DO UPDATE SET contributions_count = user_reputation.contributions_count + 1',
      [user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Movie Goofs
exports.getMovieGoofs = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await pool.query(
      `SELECT g.*, u.username FROM goofs g 
       JOIN users u ON g.user_id = u.id 
       WHERE g.movie_id = $1 
       ORDER BY g.upvotes DESC`,
      [movieId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Quote
exports.submitQuote = async (req, res) => {
  try {
    const { movie_id, quote_text, character_name } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO quotes (movie_id, user_id, quote_text, character_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [movie_id, user_id, quote_text, character_name]
    );

    await pool.query(
      'INSERT INTO user_reputation (user_id, contributions_count) VALUES ($1, 1) ON CONFLICT (user_id) DO UPDATE SET contributions_count = user_reputation.contributions_count + 1',
      [user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Movie Quotes
exports.getMovieQuotes = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await pool.query(
      `SELECT q.*, u.username FROM quotes q 
       JOIN users u ON q.user_id = u.id 
       WHERE q.movie_id = $1 
       ORDER BY q.upvotes DESC`,
      [movieId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Reputation
exports.getUserReputation = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM user_reputation WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows[0] || { reputation_score: 0, contributions_count: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
