import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTVShows();
  }, []);

  const fetchTVShows = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/movies/tv-shows');
      console.log('TV Shows Response:', response.data);
      setShows(response.data);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Popular TV Shows
          </h1>
          <p className="text-gray-300">Discover the best TV series</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shows.map((show) => (
            <Link key={show.id} to={`/tv/${show.id}`} className="block">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="relative group">
                  <img 
                    src={show.poster_url} 
                    alt={show.title} 
                    className="w-full h-80 object-cover" 
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop'} 
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{show.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{new Date(show.release_date).getFullYear()}</p>
                  {show.description && (
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">{show.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                    <span>{show.seasons} Season{show.seasons > 1 ? 's' : ''}</span>
                    <span>{show.episodes} Episodes</span>
                  </div>
                  {show.rating_count && (
                    <div className="text-xs text-gray-500">
                      {show.rating_count.toLocaleString()} views
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShows;
