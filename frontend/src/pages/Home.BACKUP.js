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
        setMovies(allMovies);
        setTrending(allMovies.slice(0, 6));
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
                  Find your perfect movie with AI & friends
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

        {/* This Week's Highlights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            This Week's Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.slice(2, 5).map((movie) => (
              <div key={movie.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
                <div className="flex gap-4">
                  <img src={movie.poster_url} alt={movie.title} className="w-20 h-28 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white font-semibold">{movie.average_rating}</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-3">{movie.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Movies Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Popular Movies
          </h2>
          {movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No movies found. Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Top Rated This Year */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Top Rated 2026
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {movies.slice(0, 4).map((movie, index) => (
              <div key={movie.id} className="relative">
                <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
                  #{index + 1}
                </div>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Hidden Gems */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Hidden Gems
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.slice(3, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact showRating={false} />
            ))}
          </div>
        </section>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Social Matching Card */}
                <Link to="/social-matching" className="group bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 border border-purple-600/20 hover:border-purple-400/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Social Matching</h3>
                  <p className="text-purple-200 mb-4">Find movies your friends will love</p>
                  <div className="flex items-center justify-center space-x-2 text-purple-300 text-sm">
                    <span>• Friend Recommendations</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-purple-300 text-sm mt-1">
                    <span>• Group Watchlists</span>
                  </div>
                  <div className="mt-4 inline-flex items-center text-purple-300 group-hover:text-white transition-colors">
                    <span className="text-sm font-semibold">Explore Now</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {/* AI Powered Card */}
                <Link to="/ai-recommendations" className="group bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 border border-indigo-600/20 hover:border-indigo-400/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">AI Powered</h3>
                  <p className="text-indigo-200 mb-4">Smart recommendations just for you</p>
                  <div className="flex items-center justify-center space-x-2 text-indigo-300 text-sm">
                    <span>• Personalized Picks</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-indigo-300 text-sm mt-1">
                    <span>• ML Algorithms</span>
                  </div>
                  <div className="mt-4 inline-flex items-center text-indigo-300 group-hover:text-white transition-colors">
                    <span className="text-sm font-semibold">Get Started</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {/* Swipe to Discover Card */}
                <Link to="/swipe-discover" className="group bg-gradient-to-br from-pink-800 to-pink-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30 border border-pink-600/20 hover:border-pink-400/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Swipe to Discover</h3>
                  <p className="text-pink-200 mb-4">Tinder-style movie discovery</p>
                  <div className="flex items-center justify-center space-x-2 text-pink-300 text-sm">
                    <span>• Quick Discovery</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-pink-300 text-sm mt-1">
                    <span>• Like/Dislike System</span>
                  </div>
                  <div className="mt-4 inline-flex items-center text-pink-300 group-hover:text-white transition-colors">
                    <span className="text-sm font-semibold">Start Swiping</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Community Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/polls" className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Polls</h3>
              <p className="text-blue-200">Vote on community polls</p>
            </Link>
            <Link to="/quizzes" className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Quizzes</h3>
              <p className="text-green-200">Test your movie knowledge</p>
            </Link>
            <Link to="/most-popular" className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Most Popular</h3>
              <p className="text-red-200">Trending movies today</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
