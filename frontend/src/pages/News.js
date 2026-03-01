import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    try {
      const url = filter === 'all'
        ? 'http://localhost:5001/api/news'
        : `http://localhost:5001/api/news?category=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'release', label: 'Releases' },
    { value: 'review', label: 'Reviews' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white text-2xl">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📰 Entertainment News
          </h1>
          <p className="text-gray-300">Stay updated with the latest movie and TV news</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                filter === cat.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              <div className="relative h-48">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600';
                  }}
                />
                <div className="absolute top-3 right-3 bg-purple-600 px-3 py-1 rounded-full text-xs font-bold capitalize">
                  {article.category}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 line-clamp-2 hover:text-purple-400 transition">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No news articles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
