import React, { useEffect, useState } from 'react';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const IndianCinema = () => {
  const [hindi, setHindi] = useState([]);
  const [telugu, setTelugu] = useState([]);
  const [kannada, setKannada] = useState([]);
  const [marathi, setMarathi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getAll();
      const allMovies = response.data || [];
      
      setHindi(allMovies.filter(m => m.language === 'Hindi'));
      setTelugu(allMovies.filter(m => m.language === 'Telugu'));
      setKannada(allMovies.filter(m => m.language === 'Kannada'));
      setMarathi(allMovies.filter(m => m.language === 'Marathi'));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🇮🇳 Indian Cinema</h1>
          <p className="text-xl text-purple-300">Bollywood, Marathi, Tollywood & More</p>
        </div>

        {/* Hindi Movies */}
        {hindi.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">🎬 Hindi Movies (Bollywood)</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {hindi.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Telugu Movies */}
        {telugu.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">🎥 Telugu Movies (Tollywood)</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {telugu.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Kannada Movies */}
        {kannada.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">🎭 Kannada Movies (Sandalwood)</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {kannada.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Marathi Movies */}
        {marathi.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">🎪 Marathi Movies</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {marathi.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Browse by Language */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Hindi', 'Marathi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Punjabi'].map(lang => (
              <Link
                key={lang}
                to={`/browse/language/${lang}`}
                className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-white">{lang}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default IndianCinema;
