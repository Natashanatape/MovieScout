import React, { useState } from 'react';
import StarRating from './StarRating';

const ReviewForm = ({ movieId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        movie_id: movieId,
        rating,
        review_text: reviewText
      });
      setRating(0);
      setReviewText('');
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-purple-400 mb-6">Write Your Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Your Rating</label>
          <StarRating rating={rating} onRate={setRating} size="lg" />
        </div>

        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Your Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows="6"
            className="w-full bg-gray-700 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-400 text-sm mt-2">
            {reviewText.length} characters (minimum 10)
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
