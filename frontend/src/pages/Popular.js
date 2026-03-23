import React, { useEffect, useState } from 'react';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      console.log('Fetching movies from backend...');
      
      const res = await movieAPI.getPopular(); // ✅ FIXED
      
      console.log('Movies received:', res.data);
      setMovies(res.data);

    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Popular Movies</h1>
          <p className="text-purple-400 text-xl">
            Movies fetched from backend 🎬
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>

        ) : movies.length === 0 ? (

          /* Empty */
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
              <p className="text-gray-400 text-xl">No movies available</p>
            </div>
          </div>

        ) : (

          /* Movies Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <div key={movie.id} className="relative">
                
                {/* Ranking Badge */}
                <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg">
                  {index + 1}
                </div>

                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
};

export default Popular;