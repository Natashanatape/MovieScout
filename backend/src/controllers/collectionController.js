const db = require('../config/database');

class CollectionController {
  static async getAll(req, res) {
    try {
      const result = await db.query('SELECT * FROM collections ORDER BY name');
      res.json({ collections: result.rows });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to get collections' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const [collection, movies] = await Promise.all([
        db.query('SELECT * FROM collections WHERE id = $1', [id]),
        db.query(
          `SELECT m.* FROM movies m
           JOIN collection_movies cm ON m.id = cm.movie_id
           WHERE cm.collection_id = $1
           ORDER BY cm.order_number`,
          [id]
        )
      ]);

      if (collection.rows.length === 0) {
        return res.status(404).json({ error: 'Collection not found' });
      }

      res.json({ 
        collection: collection.rows[0],
        movies: movies.rows 
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to get collection' });
    }
  }
}

module.exports = CollectionController;
