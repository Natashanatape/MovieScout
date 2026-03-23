import React, { useEffect, useState } from 'react';
import { watchlistAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await watchlistAPI.getAll();
      console.log('Watchlist response:', res.data);
      setWatchlist(res.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await watchlistAPI.remove(movieId);
      setWatchlist(watchlist.filter(item => item.movie_id !== movieId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Watchlist</h1>
        
        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">Your watchlist is empty</p>
            <button 
              onClick={() => navigate('/search')}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <div key={item.movie_id} className="relative">
                <MovieCard movie={{id: item.movie_id, title: item.title, poster_url: item.poster_url, release_date: item.release_date, average_rating: item.average_rating}} />
                <button
                  onClick={() => handleRemove(item.movie_id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
