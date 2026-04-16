import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(3);

  const loadMovies = (filterMonths) => {
    setLoading(true);
    axios.get(`http://localhost:5001/api/phase4/coming-soon?months=${filterMonths}`)
      .then(res => {
        setMovies(res.data.movies || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setMovies([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMovies(months);
  }, [months]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const releaseDate = new Date(dateString);
    const diffTime = releaseDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <FaCalendarAlt className="text-purple-400" />
            Coming Soon
          </h1>
          <p className="text-gray-300 text-lg">Upcoming movies and release dates</p>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No upcoming releases found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {movies.map(movie => {
              const daysUntil = getDaysUntil(movie.release_date);
              return (
                <div key={movie.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex flex-col md:flex-row">
                    <Link to={`/movie/${movie.id}`} className="md:w-48 flex-shrink-0">
                      <div className="aspect-[2/3] bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
                        {movie.poster_url ? (
                          <img 
                            src={movie.poster_url} 
                            alt={movie.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            No Poster
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 p-6">
                      <Link to={`/movie/${movie.id}`}>
                        <h2 className="text-3xl font-bold text-white mb-3 hover:text-purple-400 transition">
                          {movie.title}
                        </h2>
                      </Link>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-lg">
                          <FaCalendarAlt className="text-purple-400" />
                          <span className="text-white font-semibold">{formatDate(movie.release_date)}</span>
                        </div>
                        
                        {daysUntil > 0 && (
                          <div className="flex items-center gap-2 bg-pink-600/20 px-4 py-2 rounded-lg">
                            <FaClock className="text-pink-400" />
                            <span className="text-white font-semibold">
                              {daysUntil} {daysUntil === 1 ? 'day' : 'days'} to go
                            </span>
                          </div>
                        )}

                        {movie.release_type && (
                          <div className="bg-blue-600/20 px-4 py-2 rounded-lg">
                            <span className="text-blue-400 font-semibold capitalize">{movie.release_type}</span>
                          </div>
                        )}
                      </div>

                      {movie.description && (
                        <p className="text-gray-300 mb-4 line-clamp-3">{movie.description}</p>
                      )}

                      <div className="flex items-center gap-6 mb-4">
                        {movie.average_rating > 0 && (
                          <div className="flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            <span className="text-white font-semibold">{parseFloat(movie.average_rating).toFixed(1)}</span>
                            <span className="text-gray-400">({movie.rating_count} ratings)</span>
                          </div>
                        )}
                        
                        {movie.runtime && (
                          <span className="text-gray-400">{movie.runtime} min</span>
                        )}
                      </div>


                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;
