import React, { useEffect, useState } from 'react';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchPopular();
  }, [timeframe]);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      console.log('Fetching popular with timeframe:', timeframe);
      const res = await movieAPI.getPopular({ limit: 20, timeframe });
      console.log('Received movies:', res.data.length, 'First movie:', res.data[0]?.title);
      setMovies(res.data);
    } catch (error) {
      console.error('Error fetching popular:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Popular Movies</h1>
          <p className="text-purple-400 text-xl mb-6">
            Highest rated movies of all time
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeframe === 'today'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeframe === 'week'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeframe === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeframe === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
              <p className="text-gray-400 text-xl">No popular movies available</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <div key={movie.id} className="relative">
                <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg transform transition-all duration-300 group-hover:scale-110">
                  {index + 1}
                </div>
                <div className="group">
                  <MovieCard movie={movie} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;
