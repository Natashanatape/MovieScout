import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [selectedAward, setSelectedAward] = useState(null);
  const [nominations, setNominations] = useState([]);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/awards');
      setAwards(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchNominations = async (awardId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/awards/${awardId}/nominations`);
      setNominations(res.data);
      setSelectedAward(awardId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Awards & Honors</h1>
          <p className="text-purple-300 text-lg">Celebrating excellence in cinema</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Awards List */}
          <div className="lg:col-span-1 space-y-4">
            {awards.map((award) => (
              <button
                key={award.id}
                onClick={() => fetchNominations(award.id)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                  selectedAward === award.id
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 shadow-2xl scale-105'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{award.award_name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-semibold">{award.year}</span>
                  {award.ceremony_date && (
                    <span className="text-gray-400 text-sm">
                      {new Date(award.ceremony_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Nominations Details */}
          <div className="lg:col-span-2">
            {selectedAward ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-yellow-500/20">
                <h2 className="text-3xl font-bold text-white mb-6">Nominations & Winners</h2>
                {nominations.length > 0 ? (
                  <div className="space-y-4">
                    {nominations.map((nom, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-xl border-l-4 ${
                          nom.won
                            ? 'bg-gradient-to-r from-yellow-900/30 to-transparent border-yellow-500'
                            : 'bg-gray-800/50 border-gray-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{nom.category_name}</h3>
                            {nom.movie_title && (
                              <p className="text-purple-300 mb-1">Movie: {nom.movie_title}</p>
                            )}
                          </div>
                          {nom.won && (
                            <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                              WINNER
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No nominations data available</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-2xl shadow-2xl border border-purple-500/20 text-center">
                <p className="text-gray-400 text-xl">Select an award to view nominations and winners</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BornToday = () => {
  const [celebrities, setCelebrities] = useState([]);

  useEffect(() => {
    fetchBornToday();
  }, []);

  const fetchBornToday = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/misc/born-today');
      setCelebrities(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6 text-white">🎂 Born Today</h1>
        {celebrities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No celebrity birthdays today</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {celebrities.map((celeb) => (
              <Link
                key={celeb.id}
                to={`/celebrity/${celeb.id}`}
                className="text-center hover:opacity-80"
              >
                <img
                  src={celeb.profile_picture || '/default-avatar.png'}
                  alt={celeb.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-sm text-white">{celeb.name}</h3>
                <p className="text-xs text-gray-400">
                  {new Date().getFullYear() - new Date(celeb.birth_date).getFullYear()} years
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MostPopular = () => {
  const [movies, setMovies] = useState([]);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopular();
  }, [period]);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      // Map period to timeframe
      let timeframe = 'all';
      if (period === 'daily') timeframe = 'today';
      else if (period === 'weekly') timeframe = 'week';
      else if (period === 'monthly') timeframe = 'month';
      
      console.log('Fetching popular movies with timeframe:', timeframe);
      const res = await axios.get(`http://localhost:5001/api/movies/popular?timeframe=${timeframe}&limit=20`);
      console.log('Response received:', res.data);
      
      // Handle both array and object responses
      const moviesData = Array.isArray(res.data) ? res.data : [];
      console.log('Movies data:', moviesData.length, 'movies');
      setMovies(moviesData);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      console.error('Error details:', error.response?.data || error.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch(period) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      default: return 'Today';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Most Popular</h1>
              <p className="text-purple-300 text-lg">Trending movies {getPeriodLabel().toLowerCase()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('daily')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  period === 'daily'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setPeriod('weekly')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  period === 'weekly'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  period === 'monthly'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-16 text-center border border-gray-700">
            <div className="text-8xl mb-6">📊</div>
            <h3 className="text-3xl font-bold text-white mb-3">No Data Available</h3>
            <p className="text-gray-400 text-lg">Check back later for popularity rankings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {movies.map((movie, index) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group flex items-center gap-6 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 border border-gray-700 hover:border-purple-500/50"
              >
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-gray-900' :
                  'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                }`}>
                  #{index + 1}
                </div>

                {/* Movie Poster */}
                <img
                  src={movie.poster_url || 'https://via.placeholder.com/100x150'}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                />

                {/* Movie Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="text-white font-semibold">{movie.average_rating || 'N/A'}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">Popularity Score</span>
                  </div>
                </div>

                {/* Trending Indicator */}
                {index < 3 && (
                  <div className="flex-shrink-0">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                      🔥 TRENDING
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
