import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieRoulette = ({ movies, onClose }) => {
  const [spinning, setSpinning] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [spinCount, setSpinCount] = useState(0);
  const [luckyMessage, setLuckyMessage] = useState('');
  const navigate = useNavigate();

  const luckyMessages = [
    "The stars have aligned for this perfect pick!",
    "Your next favorite movie awaits!",
    "Destiny has chosen this masterpiece for you!",
    "This is exactly what you need to watch tonight!",
    "The universe knows your taste - enjoy this gem!",
    "Your lucky movie of the day is here!",
    "This one's going to blow your mind!",
    "Fate has spoken - this is your perfect match!",
    "Get ready for an unforgettable experience!",
    "The movie gods have blessed you with this choice!"
  ];

  useEffect(() => {
    if (movies.length === 0) return;

    let count = 0;
    const maxSpins = 12; // Reduced from 20
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setCurrentMovie(movies[randomIndex]);
      count++;
      setSpinCount(count);

      if (count >= maxSpins) {
        clearInterval(interval);
        setSpinning(false);
        
        // Set random lucky message
        const randomMsg = luckyMessages[Math.floor(Math.random() * luckyMessages.length)];
        setLuckyMessage(randomMsg);
        
        // Increased pause to 3 seconds to read message
        setTimeout(() => {
          navigate(`/movie/${movies[randomIndex].id}`);
          onClose();
        }, 3000);
      }
    }, count < 6 ? 100 : count < 10 ? 200 : 400); // Slower progression

    return () => clearInterval(interval);
  }, [movies, navigate, onClose]);

  if (!currentMovie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full">
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`absolute w-64 h-64 border-4 border-purple-500 rounded-full ${spinning ? 'animate-ping' : ''}`}></div>
          <div className={`absolute w-52 h-52 border-4 border-pink-500 rounded-full ${spinning ? 'animate-pulse' : ''}`}></div>
        </div>

        {/* Main content */}
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-8 shadow-2xl border-2 border-purple-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              {spinning ? 'Movie Roulette' : 'Your Perfect Match'}
            </h2>
            <p className="text-purple-300 text-base mb-6">
              {spinning ? 'Finding your next favorite movie...' : 'Get ready for an amazing experience!'}
            </p>

            {/* Movie Display */}
            <div className={`transition-all duration-500 ${spinning ? 'scale-90' : 'scale-100'}`}>
              <div className="relative inline-block">
                {/* Glow effect */}
                {!spinning && (
                  <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-50 animate-pulse"></div>
                )}
                
                <img
                  src={currentMovie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop'}
                  alt={currentMovie.title}
                  className={`relative w-40 h-60 mx-auto rounded-xl shadow-2xl object-cover transition-all duration-300 ${
                    spinning ? 'blur-md brightness-75' : 'blur-0 brightness-100'
                  }`}
                />
              </div>
              
              <div className="mt-6">
                <h3 className={`text-2xl font-bold text-white mb-2 transition-all duration-300 ${
                  spinning ? 'blur-sm opacity-50' : 'blur-0 opacity-100'
                }`}>
                  {currentMovie.title}
                </h3>
                <div className={`flex items-center justify-center gap-3 text-base transition-all duration-300 ${
                  spinning ? 'blur-sm opacity-50' : 'blur-0 opacity-100'
                }`}>
                  <span className="text-purple-400 font-semibold">
                    {new Date(currentMovie.release_date).getFullYear()}
                  </span>
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-white font-bold">
                      {currentMovie.average_rating ? Number(currentMovie.average_rating).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 mb-3">
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${(spinCount / 12) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Status */}
            {spinning ? (
              <div className="text-purple-300 text-sm">
                Spinning {spinCount}/12
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-green-400 text-xl font-bold animate-bounce">
                  Perfect Match Found!
                </div>
                <div className="text-purple-300 text-base font-semibold italic px-4">
                  "{luckyMessage}"
                </div>
                <div className="text-gray-400 text-xs">
                  Redirecting to movie...
                </div>
              </div>
            )}

            {/* Cancel button */}
            {spinning && (
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieRoulette;
