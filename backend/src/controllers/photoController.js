const pool = require('../config/database');

// Get photos for a movie
exports.getMoviePhotos = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { category } = req.query;
    
    let query = 'SELECT * FROM photos WHERE movie_id = $1';
    const params = [movieId];
    
    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add photo (admin only)
exports.addPhoto = async (req, res) => {
  try {
    const { movie_id, photo_url, category, caption } = req.body;
    
    const result = await pool.query(
      'INSERT INTO photos (movie_id, photo_url, category, caption) VALUES ($1, $2, $3, $4) RETURNING *',
      [movie_id, photo_url, category, caption]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;
