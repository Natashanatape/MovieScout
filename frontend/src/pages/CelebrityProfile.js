import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBirthdayCake, FaMapMarkerAlt, FaRuler, FaTrophy, FaInstagram, FaTwitter, FaFacebook, FaFilm, FaStar } from 'react-icons/fa';

const CelebrityProfile = () => {
  const { id } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCelebrity();
  }, [id]);

  const fetchCelebrity = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/celebrities/${id}`);
      setCelebrity(res.data.celebrity);
      setMovies(res.data.movies || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>;
  }

  if (!celebrity) return <div className="text-white text-center py-20">Celebrity not found</div>;

  const age = calculateAge(celebrity.birth_date);
  const actingMovies = movies.filter(m => m.role === 'Actor' || m.department === 'Acting');
  const directingMovies = movies.filter(m => m.department === 'Directing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-8xl font-bold shadow-xl">
                {celebrity.name?.charAt(0)}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <h1 className="text-6xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {celebrity.name}
              </h1>
              
              {celebrity.known_for && (
                <p className="text-xl text-gray-300 mb-6 italic">Known for {celebrity.known_for}</p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {celebrity.birth_date && (
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <FaBirthdayCake className="text-purple-400 text-2xl mb-2" />
                    <p className="text-gray-400 text-sm">Age</p>
                    <p className="text-white font-bold text-lg">{age} years</p>
                  </div>
                )}
                
                {celebrity.birth_place && (
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <FaMapMarkerAlt className="text-pink-400 text-2xl mb-2" />
                    <p className="text-gray-400 text-sm">Born In</p>
                    <p className="text-white font-bold text-sm">{celebrity.birth_place.split(',')[0]}</p>
                  </div>
                )}
                
                {celebrity.height && (
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <FaRuler className="text-blue-400 text-2xl mb-2" />
                    <p className="text-gray-400 text-sm">Height</p>
                    <p className="text-white font-bold text-lg">{celebrity.height} cm</p>
                  </div>
                )}
                
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <FaFilm className="text-yellow-400 text-2xl mb-2" />
                  <p className="text-gray-400 text-sm">Movies</p>
                  <p className="text-white font-bold text-lg">{movies.length}</p>
                </div>
              </div>

              {/* Birth Details */}
              {celebrity.birth_date && (
                <div className="bg-gray-700/30 rounded-xl p-4 mb-4">
                  <p className="text-gray-300">
                    <span className="text-purple-400 font-semibold">Born:</span> {new Date(celebrity.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {celebrity.birth_place && <span className="text-gray-400"> in {celebrity.birth_place}</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Biography */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-600 rounded"></span>
              Biography
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed line-clamp-5">
              {celebrity.biography || 'No biography available yet.'}
            </p>
          </div>

          {/* Known For Movies */}
          {actingMovies.length > 0 && (
            <div className="bg-gray-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-pink-600 rounded"></span>
                Known For
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {actingMovies.slice(0, 5).map(movie => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="group">
                    <div className="bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                      <div className="aspect-[2/3] bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                        {movie.poster_url ? (
                          <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <FaFilm className="text-6xl text-gray-600" />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition">
                          {movie.title}
                        </h3>
                        {movie.character_name && (
                          <p className="text-gray-400 text-xs truncate">as {movie.character_name}</p>
                        )}
                        {movie.release_date && (
                          <p className="text-gray-500 text-xs mt-1">{new Date(movie.release_date).getFullYear()}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CelebrityProfile;
