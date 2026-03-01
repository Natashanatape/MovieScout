import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { celebrityAPI } from '../services/api';

const Celebrities = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({});
  const [popularCelebrities, setPopularCelebrities] = useState([]);
  const [bornToday, setBornToday] = useState([]);

  useEffect(() => {
    fetchCelebrities();
    fetchPopularCelebrities();
    fetchBornToday();
  }, []);

  const fetchCelebrities = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await celebrityAPI.getAll({ page, search });
      setCelebrities(response.data.celebrities);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching celebrities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularCelebrities = async () => {
    try {
      const response = await celebrityAPI.getPopular({ limit: 6 });
      setPopularCelebrities(response.data);
    } catch (error) {
      console.error('Error fetching popular celebrities:', error);
    }
  };

  const fetchBornToday = async () => {
    try {
      const response = await celebrityAPI.getBornToday();
      setBornToday(response.data);
    } catch (error) {
      console.error('Error fetching born today:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCelebrities(1, searchQuery);
  };

  const CelebrityCard = ({ celebrity, compact = false }) => (
    <Link to={`/celebrity/${celebrity.id}`} className="block group">
      <div className={`bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 border border-purple-500/20 ${
        compact ? 'p-3' : 'p-5'
      }`}>
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={celebrity.profile_image || 'https://via.placeholder.com/200x250?text=No+Image'}
            alt={celebrity.name}
            loading="lazy"
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              compact ? 'h-40' : 'h-56'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <h3 className={`text-white font-bold group-hover:text-purple-300 transition-colors duration-300 ${
          compact ? 'text-sm' : 'text-lg'
        }`}>
          {celebrity.name}
        </h3>
        {celebrity.known_for && (
          <p className={`text-gray-300 mt-1 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {celebrity.known_for}
          </p>
        )}
        {celebrity.movie_count > 0 && (
          <p className={`text-purple-400 mt-2 font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
            {celebrity.movie_count} movies
          </p>
        )}
        {celebrity.age && (
          <p className={`text-yellow-400 mt-1 font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
            {celebrity.age} years old today! 🎂
          </p>
        )}
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Celebrities</h1>
          <p className="text-purple-300">Discover your favorite actors, directors, and more</p>
        </div>

        {/* Search */}
        <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-purple-500/20">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search celebrities by name..."
              className="flex-1 px-6 py-4 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Born Today Section */}
        {bornToday.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">🎂</span> Born Today
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bornToday.map((celebrity) => (
                <CelebrityCard key={celebrity.id} celebrity={celebrity} compact />
              ))}
            </div>
          </section>
        )}

        {/* Popular Celebrities */}
        {popularCelebrities.length > 0 && !searchQuery && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Most Popular</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularCelebrities.map((celebrity) => (
                <CelebrityCard key={celebrity.id} celebrity={celebrity} />
              ))}
            </div>
          </section>
        )}

        {/* All Celebrities */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Celebrities'}
            </h2>
            {pagination.total && (
              <p className="text-purple-300">
                {pagination.total} celebrities found
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : celebrities.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {celebrities.map((celebrity) => (
                  <CelebrityCard key={celebrity.id} celebrity={celebrity} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => fetchCelebrities(i + 1, searchQuery)}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.page === i + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">No celebrities found</h3>
                <p className="text-gray-400">
                  {searchQuery 
                    ? `No celebrities found matching "${searchQuery}"`
                    : 'No celebrities available'
                  }
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Celebrities;
