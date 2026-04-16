import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, compact, showRating = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Better image URL handling
  const getImageUrl = () => {
    if (movie.poster_url && !imageError) {
      return movie.poster_url;
    }
    return `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop`;
  };
  
  const posterUrl = getImageUrl();
  
  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className={`w-full ${compact ? 'h-64' : 'h-96'} bg-gray-700 animate-pulse`} />
          )}
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className={`w-full ${compact ? 'h-64' : 'h-96'} object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageError(true);
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop';
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {showRating && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1 transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">★</span>
              {movie.average_rating ? Number(movie.average_rating).toFixed(1) : 'N/A'}
            </div>
          )}
        </div>
        <div className={compact ? 'p-2' : 'p-4'}>
          <h3 className={`text-white font-semibold ${compact ? 'text-sm' : 'text-lg'} truncate group-hover:text-purple-300 transition-colors duration-300`}>{movie.title}</h3>
          <p className={`text-purple-300 ${compact ? 'text-xs' : 'text-sm'} group-hover:text-purple-200 transition-colors duration-300`}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
