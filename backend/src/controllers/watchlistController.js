const Watchlist = require('../models/Watchlist');

class WatchlistController {
  static async add(req, res) {
    try {
      const { movie_id } = req.body;
      const user_id = req.user.id;

      if (!movie_id) {
        return res.status(400).json({ error: 'Movie ID required' });
      }

      const item = await Watchlist.add(user_id, movie_id);

      res.status(201).json({
        message: 'Added to watchlist',
        item,
      });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ error: 'Failed to add to watchlist' });
    }
  }

  static async remove(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.user.id;

      const deleted = await Watchlist.remove(user_id, movie_id);

      if (!deleted) {
        return res.status(404).json({ error: 'Item not found in watchlist' });
      }

      res.json({ message: 'Removed from watchlist' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove from watchlist' });
    }
  }

  static async getAll(req, res) {
    try {
      const user_id = req.user.id;
      const watchlist = await Watchlist.getByUserId(user_id);

      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
  }

  static async check(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.user.id;

      const inWatchlist = await Watchlist.isInWatchlist(user_id, movie_id);

      res.json({ inWatchlist });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check watchlist' });
    }
  }
}

module.exports = WatchlistController;
