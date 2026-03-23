const pool = require('../config/database');

// Get all news articles
exports.getAllNews = async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM news_articles';
    const params = [];
    
    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY published_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single news article
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM news_articles WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add news article (admin only)
exports.addNews = async (req, res) => {
  try {
    const { title, content, summary, category, author, image_url } = req.body;
    
    const result = await pool.query(
      'INSERT INTO news_articles (title, content, summary, category, author, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, content, summary, category, author, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;
