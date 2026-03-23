const pool = require('../config/database');

// Create Poll
exports.createPoll = async (req, res) => {
  try {
    const { title, description, options, expires_at } = req.body;
    const created_by = req.user.id;

    const pollResult = await pool.query(
      'INSERT INTO polls (title, description, created_by, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, created_by, expires_at]
    );

    const poll = pollResult.rows[0];

    // Insert options
    for (const option of options) {
      await pool.query(
        'INSERT INTO poll_options (poll_id, option_text) VALUES ($1, $2)',
        [poll.id, option]
      );
    }

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Polls
exports.getPolls = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username, 
        (SELECT COUNT(*) FROM poll_votes WHERE poll_id = p.id) as total_votes
       FROM polls p 
       JOIN users u ON p.created_by = u.id 
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Poll Details
exports.getPollDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const poll = await pool.query(
      `SELECT p.*, u.username FROM polls p 
       JOIN users u ON p.created_by = u.id 
       WHERE p.id = $1`,
      [id]
    );

    const options = await pool.query(
      'SELECT * FROM poll_options WHERE poll_id = $1',
      [id]
    );

    res.json({ ...poll.rows[0], options: options.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vote on Poll
exports.votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option_id } = req.body;
    const user_id = req.user.id;

    // Check if already voted
    const existing = await pool.query(
      'SELECT * FROM poll_votes WHERE poll_id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already voted' });
    }

    await pool.query(
      'INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES ($1, $2, $3)',
      [id, option_id, user_id]
    );

    await pool.query(
      'UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = $1',
      [option_id]
    );

    res.json({ message: 'Vote recorded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Poll Results
exports.getPollResults = async (req, res) => {
  try {
    const { id } = req.params;
    
    const options = await pool.query(
      'SELECT * FROM poll_options WHERE poll_id = $1 ORDER BY vote_count DESC',
      [id]
    );

    const total = await pool.query(
      'SELECT COUNT(*) FROM poll_votes WHERE poll_id = $1',
      [id]
    );

    res.json({
      options: options.rows,
      totalVotes: parseInt(total.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
