import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrophy, FaDollarSign, FaTheaterMasks } from 'react-icons/fa';

const BoxOffice = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoxOffice();
  }, []);

  const fetchBoxOffice = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/phase4/box-office/weekend');
      setMovies(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            <FaTrophy className="text-yellow-400" />
            Box Office
          </h1>
          <p className="text-gray-300 text-lg">Weekend Top 10 Earnings</p>
        </div>

        <div className="space-y-4">
          {movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No box office data available</p>
            </div>
          ) : (
            movies.map((movie, index) => (
              <div key={movie.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                <div className="flex flex-col md:flex-row items-center">
                  {/* Rank Badge */}
                  <div className="md:w-24 flex-shrink-0 bg-gradient-to-br from-yellow-500 to-orange-500 p-6 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">#{index + 1}</span>
                  </div>

                  {/* Poster */}
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

                  {/* Details */}
                  <div className="flex-1 p-6">
                    <Link to={`/movie/${movie.id}`}>
                      <h2 className="text-3xl font-bold text-white mb-3 hover:text-purple-400 transition">
                        {movie.title}
                      </h2>
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-600/20 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <FaDollarSign className="text-green-400" />
                          <span className="text-gray-400 text-sm">Weekend Gross</span>
                        </div>
                        <span className="text-white font-bold text-xl">
                          {formatCurrency(movie.weekend_gross)}
                        </span>
                      </div>

                      <div className="bg-blue-600/20 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <FaDollarSign className="text-blue-400" />
                          <span className="text-gray-400 text-sm">Total Gross</span>
                        </div>
                        <span className="text-white font-bold text-xl">
                          {formatCurrency(movie.total_gross)}
                        </span>
                      </div>

                      <div className="bg-purple-600/20 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <FaTheaterMasks className="text-purple-400" />
                          <span className="text-gray-400 text-sm">Theaters</span>
                        </div>
                        <span className="text-white font-bold text-xl">
                          {movie.theater_count?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxOffice;
