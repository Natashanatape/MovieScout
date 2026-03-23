import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterGenre, setFilterGenre] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 12;

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams, sortBy, filterGenre]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await movieAPI.search(searchQuery);
      let results = response.data;
      
      // Filter by genre
      if (filterGenre !== 'all') {
        results = results.filter(movie => 
          movie.genres?.some(g => g.name === filterGenre)
        );
      }
      
      // Sort results
      if (sortBy === 'rating') {
        results.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      } else if (sortBy === 'year') {
        results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else if (sortBy === 'title') {
        results.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      setMovies(results);
      setTotalPages(Math.ceil(results.length / moviesPerPage));
    } catch (error) {
      console.error('Search error:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Search Movies
          </h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies by title..."
              className="flex-1 px-6 py-4 rounded-xl bg-gray-800 text-white border-2 border-gray-700 focus:outline-none focus:border-purple-500 text-lg transition-all duration-300"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg transform hover:scale-105"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div>
            <div className="text-center text-purple-400 text-xl mb-8 animate-pulse">
              Searching for "{query}"...
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && movies.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-3xl font-bold text-white mb-4">No movies found</h2>
              <p className="text-gray-400 text-lg mb-6">
                We couldn't find any movies matching "<span className="text-purple-400">{query}</span>"
              </p>
              <p className="text-gray-500">
                Try searching with different keywords or check your spelling
              </p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && movies.length > 0 && (
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Search Results
                </h2>
                <p className="text-purple-400 text-lg">
                  Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'} for "{query}"
                </p>
              </div>
              
              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:bg-gray-700"
                >
                  <option value="all">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Adventure">Adventure</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:bg-gray-700"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Newest First</option>
                  <option value="title">A-Z</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* Initial State */}
        {!loading && !searched && (
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
              <svg className="w-24 h-24 mx-auto mb-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h2 className="text-3xl font-bold text-white mb-4">Discover Movies</h2>
              <p className="text-gray-400 text-lg">
                Search for your favorite movies by title, actor, or director
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
