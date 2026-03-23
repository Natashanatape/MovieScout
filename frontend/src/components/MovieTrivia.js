import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieTrivia = ({ movieId }) => {
  const [trivia, setTrivia] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [triviaText, setTriviaText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrivia();
  }, [movieId]);

  const fetchTrivia = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/contributions/trivia/movie/${movieId}`);
      setTrivia(res.data);
    } catch (error) {
      console.error('Error fetching trivia:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/contributions/trivia',
        { movie_id: movieId, trivia_text: triviaText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTriviaText('');
      setShowForm(false);
      fetchTrivia();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, vote) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/contributions/trivia/${id}/vote`,
        { vote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTrivia();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-purple-500/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Do You Know</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Fact'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-900/50 rounded-lg border border-purple-500/30">
          <textarea
            value={triviaText}
            onChange={(e) => setTriviaText(e.target.value)}
            placeholder="Share an interesting fact about this movie..."
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg mb-3 focus:outline-none focus:border-purple-500 text-sm"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}

      {trivia.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No facts added yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trivia.map((item) => (
            <div key={item.id} className="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
              <p className="text-white mb-3">{item.trivia_text}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">by <span className="text-purple-400">{item.username}</span></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(item.id, 'up')}
                    className="flex items-center gap-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-1 rounded-full transition-all"
                  >
                    👍 {item.upvotes}
                  </button>
                  <button
                    onClick={() => handleVote(item.id, 'down')}
                    className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded-full transition-all"
                  >
                    👎 {item.downvotes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieTrivia;
