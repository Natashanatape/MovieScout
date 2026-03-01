const pool = require('../config/database');

// Spoiler Settings
exports.getSpoilerSettings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      'SELECT * FROM spoiler_settings WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows[0] || { hide_spoilers: true, spoiler_threshold_days: 30 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSpoilerSettings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { hide_spoilers, spoiler_threshold_days } = req.body;
    
    await pool.query(
      `INSERT INTO spoiler_settings (user_id, hide_spoilers, spoiler_threshold_days) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id) DO UPDATE 
       SET hide_spoilers = $2, spoiler_threshold_days = $3`,
      [user_id, hide_spoilers, spoiler_threshold_days]
    );
    
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Report Comment
exports.reportComment = async (req, res) => {
  try {
    const { comment_id, reason } = req.body;
    const reported_by = req.user.id;
    
    await pool.query(
      'INSERT INTO comment_reports (comment_id, reported_by, reason) VALUES ($1, $2, $3)',
      [comment_id, reported_by, reason]
    );
    
    res.json({ message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Popularity Rankings
exports.getPopularMovies = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    let dateFilter = 'CURRENT_DATE';
    if (period === 'weekly') dateFilter = 'CURRENT_DATE - INTERVAL \'7 days\'';
    if (period === 'monthly') dateFilter = 'CURRENT_DATE - INTERVAL \'30 days\'';
    
    const result = await pool.query(
      `SELECT pr.*, m.title, m.poster_url
       FROM popularity_rankings pr
       JOIN movies m ON pr.entity_id = m.id
       WHERE pr.entity_type = 'movie' AND pr.date >= ${dateFilter}
       ORDER BY pr.rank ASC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrendingCelebrities = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, c.name, c.profile_picture
       FROM popularity_rankings pr
       JOIN celebrities c ON pr.entity_id = c.id
       WHERE pr.entity_type = 'celebrity' AND pr.date = CURRENT_DATE
       ORDER BY pr.rank ASC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Born Today
exports.getBornToday = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM celebrities 
       WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(DAY FROM birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
       ORDER BY birth_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBornOnDate = async (req, res) => {
  try {
    const { date } = req.params;
    const [month, day] = date.split('-');
    
    const result = await pool.query(
      `SELECT * FROM celebrities 
       WHERE EXTRACT(MONTH FROM birth_date) = $1
       AND EXTRACT(DAY FROM birth_date) = $2
       ORDER BY birth_date DESC`,
      [month, day]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
