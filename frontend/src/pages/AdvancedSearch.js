import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { advancedSearchAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    genres: searchParams.getAll('genre') || [],
    yearFrom: searchParams.get('yearFrom') || '',
    yearTo: searchParams.get('yearTo') || '',
    ratingFrom: searchParams.get('ratingFrom') || '',
    ratingTo: searchParams.get('ratingTo') || '',
    sortBy: searchParams.get('sortBy') || 'relevance'
  });
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    years: { min: 1900, max: 2024 },
    ratings: { min: 1, max: 10 }
  });
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (Object.values(filters).some(v => v !== '' && v.length !== 0)) {
      performSearch();
    }
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await advancedSearchAPI.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const performSearch = async (page = 1) => {
    setLoading(true);
    try {
      const searchFilters = { ...filters, page };
      const response = await advancedSearchAPI.search(searchFilters);
      setMovies(response.data.movies);
      setPagination(response.data.pagination);
      
      // Update URL
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value !== '' && value.length !== 0) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.set(key, value);
          }
        }
      });
      setSearchParams(params);
    } catch (error) {
      console.error('Search error:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genres: [],
      yearFrom: '',
      yearTo: '',
      ratingFrom: '',
      ratingTo: '',
      sortBy: 'relevance'
    });
    setMovies([]);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Advanced Search</h1>
          <p className="text-purple-300">Find movies with detailed filters</p>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              placeholder="Search movies by title..."
              className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500 transition-all duration-300"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              Clear All
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-700">
              {/* Genres */}
              <div>
                <label className="block text-white font-semibold mb-3">Genres</label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filterOptions.genres.map(genre => (
                    <label key={genre} className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                        className="mr-2 rounded"
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-white font-semibold mb-3">Release Year</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={filters.yearFrom}
                    onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                    placeholder="From"
                    min={filterOptions.years.min}
                    max={filterOptions.years.max}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="number"
                    value={filters.yearTo}
                    onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                    placeholder="To"
                    min={filterOptions.years.min}
                    max={filterOptions.years.max}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div>
                <label className="block text-white font-semibold mb-3">Rating</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={filters.ratingFrom}
                    onChange={(e) => handleFilterChange('ratingFrom', e.target.value)}
                    placeholder="Min Rating"
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="number"
                    value={filters.ratingTo}
                    onChange={(e) => handleFilterChange('ratingTo', e.target.value)}
                    placeholder="Max Rating"
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-white font-semibold mb-3">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Newest First</option>
                  <option value="title">A-Z</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters */}
        {(filters.genres.length > 0 || filters.yearFrom || filters.yearTo || filters.ratingFrom || filters.ratingTo) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.genres.map(genre => (
                <span key={genre} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center transform hover:scale-105 transition-all duration-300">
                  {genre}
                  <button
                    onClick={() => handleGenreToggle(genre)}
                    className="ml-2 hover:text-red-300 transition-colors duration-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.yearFrom && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  From {filters.yearFrom}
                </span>
              )}
              {filters.yearTo && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  To {filters.yearTo}
                </span>
              )}
              {filters.ratingFrom && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  Rating ≥ {filters.ratingFrom}
                </span>
              )}
              {filters.ratingTo && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  Rating ≤ {filters.ratingTo}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Search Results ({pagination.total} movies)
              </h2>
              <p className="text-purple-300">
                Page {pagination.page} of {pagination.pages}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => performSearch(i + 1)}
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
              <h2 className="text-3xl font-bold text-white mb-4">No Results Found</h2>
              <p className="text-gray-400 text-lg">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;