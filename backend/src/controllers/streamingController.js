const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

class StreamingController {
  // Get streaming availability for a movie
  static async getMovieStreaming(req, res) {
    try {
      const { id } = req.params;
      
      const result = await pool.query(`
        SELECT sa.*, sp.name as platform_name, sp.logo_url, sp.website_url
        FROM streaming_availability sa
        JOIN streaming_platforms sp ON sa.platform_id = sp.id
        WHERE sa.movie_id = $1
        ORDER BY 
          CASE sa.availability_type
            WHEN 'Subscription' THEN 1
            WHEN 'Free' THEN 2
            WHEN 'Rent' THEN 3
            WHEN 'Buy' THEN 4
          END,
          sa.price ASC NULLS FIRST
      `, [id]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get streaming error:', error);
      res.status(500).json({ error: 'Failed to fetch streaming data' });
    }
  }

  // Get all platforms
  static async getPlatforms(req, res) {
    try {
      const result = await pool.query(`
        SELECT * FROM streaming_platforms ORDER BY name
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Get platforms error:', error);
      res.status(500).json({ error: 'Failed to fetch platforms' });
    }
  }

  // Set price alert
  static async setPriceAlert(req, res) {
    try {
      const userId = req.user.id;
      const { movie_id, target_price } = req.body;

      await pool.query(`
        INSERT INTO price_alerts (user_id, movie_id, target_price)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, movie_id) 
        DO UPDATE SET target_price = $3
      `, [userId, movie_id, target_price]);

      res.json({ message: 'Price alert set successfully' });
    } catch (error) {
      console.error('Set price alert error:', error);
      res.status(500).json({ error: 'Failed to set price alert' });
    }
  }

  // Get user's price alerts
  static async getUserAlerts(req, res) {
    try {
      const userId = req.user.id;

      const result = await pool.query(`
        SELECT pa.*, m.title, m.poster_url
        FROM price_alerts pa
        JOIN movies m ON pa.movie_id = m.id
        WHERE pa.user_id = $1 AND pa.notified = false
        ORDER BY pa.created_at DESC
      `, [userId]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get alerts error:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }
}

module.exports = StreamingController;
