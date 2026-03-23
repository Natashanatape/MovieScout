import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SocialFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/social/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeed(res.data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-8 h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-3">Friend Activity</h1>
          <p className="text-xl text-purple-300">See what your friends are watching and rating</p>
        </div>

        {feed.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-16 text-center border border-gray-700">
            <div className="text-8xl mb-6">🎬</div>
            <h3 className="text-3xl font-bold text-white mb-3">Your Feed is Empty</h3>
            <p className="text-gray-400 text-lg mb-8">Follow friends to see their movie activity</p>
            <Link
              to="/search"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Find Friends
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {feed.map((activity, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 border border-gray-700"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: User Info & Action */}
                  <div className="md:w-1/3 p-8 bg-gradient-to-br from-purple-900/50 to-transparent">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={activity.profile_picture || 'https://via.placeholder.com/60'}
                        alt={activity.username}
                        className="w-16 h-16 rounded-full border-3 border-purple-500 shadow-lg"
                      />
                      <div>
                        <Link
                          to={`/profile/${activity.username}`}
                          className="font-bold text-xl text-white hover:text-purple-400 transition-colors block"
                        >
                          {activity.username}
                        </Link>
                        <span className="text-sm text-gray-400">{getTimeAgo(activity.created_at)}</span>
                      </div>
                    </div>

                    {activity.type === 'rating' ? (
                      <div className="mt-6">
                        <div className="text-gray-400 text-sm mb-2">RATED THIS MOVIE</div>
                        {activity.rating && (
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-3xl font-black px-5 py-3 rounded-xl shadow-lg">
                              {activity.rating}
                            </div>
                            <div className="text-gray-400 text-lg">/10</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-6">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full inline-block">
                          📝 WROTE A REVIEW
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Movie Info */}
                  <div className="md:w-2/3 p-8">
                    <Link
                      to={`/movie/${activity.movie_id}`}
                      className="group"
                    >
                      <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-400">
                        <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">Movie</span>
                        <span>•</span>
                        <span>Click to view details</span>
                      </div>
                    </Link>

                    {activity.type === 'review' && (
                      <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="text-gray-300 italic">
                          "Click to read the full review..."
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
