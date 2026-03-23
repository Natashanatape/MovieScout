import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/review/${reviewId}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/comments',
        { review_id: reviewId, comment_text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, vote) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/comments/${id}/vote`,
        { vote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border rounded"
          rows="3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded">
            <div className="flex items-start gap-3">
              <img
                src={comment.profile_picture || '/default-avatar.png'}
                alt={comment.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800">{comment.comment_text}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleVote(comment.id, 'up')}
                    className="text-sm hover:text-green-600"
                  >
                    👍 {comment.upvotes}
                  </button>
                  <button
                    onClick={() => handleVote(comment.id, 'down')}
                    className="text-sm hover:text-red-600"
                  >
                    👎 {comment.downvotes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
