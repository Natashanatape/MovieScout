const Review = require('../models/Review');
const Joi = require('joi');

const reviewSchema = Joi.object({
  movie_id: Joi.number().required(),
  review_text: Joi.string().min(10).max(5000).required(),
  rating: Joi.number().min(1).max(10).required(),
});

class ReviewController {
  static async create(req, res) {
    try {
      const { error } = reviewSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { movie_id, review_text, rating } = req.body;
      const user_id = req.user.id;

      const review = await Review.create({ user_id, movie_id, review_text, rating });

      res.status(201).json({
        message: 'Review created successfully',
        review,
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  }

  static async getByMovie(req, res) {
    try {
      const { movie_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const reviews = await Review.findByMovieId(movie_id, { limit: parseInt(limit), offset });

      res.json(reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  static async getByUser(req, res) {
    try {
      const user_id = req.user.id;
      const reviews = await Review.findByUserId(user_id);

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { review_text, rating } = req.body;
      const user_id = req.user.id;

      const review = await Review.update(id, user_id, { review_text, rating });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({ message: 'Review updated successfully', review });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const deleted = await Review.delete(id, user_id);

      if (!deleted) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }

  static async vote(req, res) {
    try {
      const { id } = req.params;
      const { vote_type } = req.body;
      const user_id = req.user.id;

      if (!['helpful', 'not_helpful'].includes(vote_type)) {
        return res.status(400).json({ error: 'Invalid vote type' });
      }

      await Review.voteHelpful(id, user_id, vote_type);

      res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record vote' });
    }
  }
}

module.exports = ReviewController;
