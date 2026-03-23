import React, { useEffect, useState } from 'react';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';
import { Link, useNavigate } from 'react-router-dom';
import MovieRoulette from '../components/MovieRoulette';
import ActivityFeed from '../components/ActivityFeed';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoulette, setShowRoulette] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const navigate = useNavigate();

  const handleFeelingLucky = () => {
    if (movies.length > 0) {
      setShowRoulette(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await movieAPI.getAll();
        const allMovies = moviesRes.data || [];
        
        // Shuffle movies for variety
        const shuffled = [...allMovies].sort(() => Math.random() - 0.5);
        
        setMovies(shuffled);
        setTrending(shuffled.slice(0, 6));
        setTotalMovies(allMovies.length);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMovies([]);
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-12 mb-12 animate-pulse">
            <div className="h-12 bg-purple-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-purple-700 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {showRoulette && (
        <MovieRoulette 
          movies={movies} 
          onClose={() => setShowRoulette(false)} 
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <div 
              className="h-96 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=400&fit=crop)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-800 to-transparent opacity-90"></div>
              <div className="relative z-10 h-full flex flex-col justify-center px-12">
                <h1 className="text-6xl font-bold text-white mb-4">
                  MovieScout
                </h1>
                <p className="text-2xl text-purple-200 mb-6 max-w-2xl">
                  Swipe. Match. Watch. <br/>
                  Find your perfect movie with AI & friends<br/>
                  <span className="text-lg text-purple-300">📊 {totalMovies} movies available</span>
                </p>
                <div className="flex gap-4">
                  <Link 
                    to="/search" 
                    className="bg-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start Discovering
                  </Link>
                  <button 
                    onClick={handleFeelingLucky}
                    className="bg-white bg-opacity-20 backdrop-blur text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Feeling Lucky
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Trending Now
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact showRating={false} />
              ))}
            </div>
          </section>
        )}

        {/* New Releases Section */}
        {movies.length > 6 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              New Releases
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.slice(6, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact showRating={false} />
              ))}
            </div>
          </section>
        )}

        {/* This Week's Highlights */}
        {movies.length > 12 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              This Week's Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {movies.slice(12, 15).map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                  <div className="flex gap-4">
                    <img src={movie.poster_url || '/placeholder.jpg'} alt={movie.title} className="w-20 h-28 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white font-semibold">{movie.average_rating || 'N/A'}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-3">{movie.description || 'No description available'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Movies Section */}
        {movies.length > 15 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Popular Movies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.slice(15, 31).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Top Rated This Year */}
        {movies.length > 31 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Top Rated 2026
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {movies.slice(31, 35).map((movie, index) => (
                <div key={movie.id} className="relative">
                  <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
                    #{index + 1}
                  </div>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hidden Gems */}
        {movies.length > 35 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Hidden Gems
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {movies.slice(35, 40).map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact showRating={false} />
              ))}
            </div>
          </section>
        )}

        {/* Browse by Genre */}
        <section className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Adventure'].map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre}`}
                className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
              >
                <h3 className="text-lg font-bold text-white">{genre}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Swipe to Discover - Full Width Card */}
              <Link to="/swipe-discover" className="group relative rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/50 block">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=400&fit=crop" 
                    alt="Swipe to Discover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-900/95 via-purple-900/90 to-pink-900/95"></div>
                </div>
                <div className="relative p-12">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-500 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-4xl font-bold text-white mb-3 group-hover:text-pink-200 transition-colors">Swipe to Discover</h3>
                      <p className="text-pink-200 text-xl mb-4">Tinder-style movie discovery - Swipe right to like, left to pass</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2 text-pink-300 bg-pink-800/30 px-4 py-2 rounded-full">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                          </svg>
                          <span className="font-semibold">Quick Discovery</span>
                        </div>
                        <div className="flex items-center space-x-2 text-pink-300 bg-pink-800/30 px-4 py-2 rounded-full">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                          </svg>
                          <span className="font-semibold">Like/Dislike System</span>
                        </div>
                        <div className="flex items-center space-x-2 text-pink-300 bg-pink-800/30 px-4 py-2 rounded-full">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="font-semibold">Build Your Watchlist</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/20 transition-all">
                        <svg className="w-8 h-8 text-white group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Community Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/polls" className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Polls</h3>
              <p className="text-blue-200">Vote on community polls</p>
            </Link>
            <Link to="/most-popular" className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Most Popular</h3>
              <p className="text-red-200">Trending movies today</p>
            </Link>
          </div>
        </section>

        {/* Phase 4 Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">More Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/coming-soon" className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop" 
                  alt="Coming Soon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-900/80 to-purple-900/90"></div>
              </div>
              <div className="relative p-8">
                <h3 className="text-3xl font-bold text-white mb-2">Coming Soon</h3>
                <p className="text-purple-200 text-lg">Upcoming movie releases & trailers</p>
              </div>
            </Link>
            
            <Link to="/box-office" className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop" 
                  alt="Box Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/90 via-orange-900/80 to-red-900/90"></div>
              </div>
              <div className="relative p-8">
                <h3 className="text-3xl font-bold text-white mb-2">Box Office</h3>
                <p className="text-yellow-200 text-lg">Weekend top 10 earnings & stats</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
