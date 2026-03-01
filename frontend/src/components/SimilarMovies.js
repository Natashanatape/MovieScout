import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const SimilarMovies = ({ movieId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilar();
  }, [movieId]);

  const fetchSimilar = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/recommendations/similar/${movieId}`);
      setMovies(res.data.similar || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || movies.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6 mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">You May Also Like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.slice(0, 8).map(movie => (
          <MovieCard key={movie.id} movie={movie} compact />
        ))}
      </div>
    </div>
  );
};

export default SimilarMovies;
