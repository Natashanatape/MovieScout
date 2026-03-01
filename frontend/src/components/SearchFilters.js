import React, { useState } from 'react';

const SearchFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    language: '',
    industry: '',
    sortBy: 'popularity'
  });

  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Adventure'];
  const languages = ['All', 'English', 'Hindi', 'Marathi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'];
  const industries = ['All', 'Hollywood', 'Bollywood', 'Marathi Cinema', 'Tollywood', 'Kollywood', 'Sandalwood', 'Mollywood'];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const ratings = [9, 8, 7, 6, 5];

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { genre: '', year: '', rating: '', language: '', industry: '', sortBy: 'popularity' };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Filters</h3>
        <button
          onClick={handleReset}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Year</label>
          <select
            value={filters.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Min Rating</label>
          <select
            value={filters.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any Rating</option>
            {ratings.map(rating => (
              <option key={rating} value={rating}>{rating}+ Stars</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Language</label>
          <select
            value={filters.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang === 'All' ? '' : lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Industry</label>
          <select
            value={filters.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind === 'All' ? '' : ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release_date">Release Date</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
