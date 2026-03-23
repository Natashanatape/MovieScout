import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAPI, watchlistAPI, reviewAPI, ratingAPI } from '../services/api';
import Toast from '../components/Toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ watchlist: 0, reviews: 0, ratings: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const [profileRes, watchlistRes, reviewsRes] = await Promise.all([
        authAPI.getMe(),
        watchlistAPI.getAll(),
        reviewAPI.getByUser()
      ]);
      
      setProfile(profileRes.data.user);
      setFormData({
        username: profileRes.data.user.username,
        email: profileRes.data.user.email
      });
      
      setStats({
        watchlist: watchlistRes.data.length,
        reviews: reviewsRes.data.length,
        ratings: reviewsRes.data.length // Same as reviews for now
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setEditing(false);
    } catch (error) {
      setToast({ message: 'Failed to update profile', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{profile?.username}</h1>
              <p className="text-gray-400 text-lg">{profile?.email}</p>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Edit Profile
            </button>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.ratings}</div>
            <div className="text-gray-400">Movies Rated</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.reviews}</div>
            <div className="text-gray-400">Reviews Written</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.watchlist}</div>
            <div className="text-gray-400">Watchlist Items</div>
          </div>
        </div>

        {/* Activity Sections */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
            <p className="text-gray-400">No recent activity</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Favorite Genres</h2>
            <div className="flex flex-wrap gap-3">
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full">Action</span>
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full">Drama</span>
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full">Sci-Fi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
