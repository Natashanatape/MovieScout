const pool = require('../config/database');

// Get All Awards
exports.getAwards = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM awards ORDER BY year DESC, ceremony_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Award Nominations
exports.getAwardNominations = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT an.*, ac.category_name, m.title as movie_title
       FROM award_nominations an
       JOIN award_categories ac ON an.category_id = ac.id
       LEFT JOIN movies m ON an.movie_id = m.id
       WHERE an.award_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Movie Awards
exports.getMovieAwards = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await pool.query(
      `SELECT a.award_name, a.year, ac.category_name, an.won
       FROM award_nominations an
       JOIN awards a ON an.award_id = a.id
       JOIN award_categories ac ON an.category_id = ac.id
       WHERE an.movie_id = $1
       ORDER BY a.year DESC`,
      [movieId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Awards Calendar
exports.getAwardsCalendar = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM awards 
       WHERE ceremony_date >= CURRENT_DATE 
       ORDER BY ceremony_date ASC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
