import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const StreamingGuide = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [streaming, setStreaming] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    if (id) {
      fetchMovieStreaming();
    } else {
      fetchPlatforms();
    }
  }, [id]);

  const fetchMovieStreaming = async () => {
    try {
      const [movieRes, streamRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/movies/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/streaming/movie/${id}`)
      ]);
      setMovie(movieRes.data);
      setStreaming(streamRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/streaming/platforms`);
      setPlatforms(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSetAlert = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/streaming/price-alert`,
        { movie_id: id, target_price: parseFloat(targetPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Price alert set successfully!');
      setShowAlert(false);
      setTargetPrice('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to set alert');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-2xl">Loading...</div>;
  }

  // Movie Streaming Page
  if (id && movie) {
    const subscription = streaming.filter(s => s.availability_type === 'Subscription');
    const rent = streaming.filter(s => s.availability_type === 'Rent');
    const buy = streaming.filter(s => s.availability_type === 'Buy');
    const free = streaming.filter(s => s.availability_type === 'Free');

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Movie Header */}
          <div className="bg-gray-800 rounded-2xl p-8 mb-8 flex gap-6">
            <img src={movie.poster_url} alt={movie.title} className="w-32 h-48 object-cover rounded-lg" />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-gray-300 mb-4">{movie.description}</p>
              <Link to={`/movie/${movie.id}`} className="text-purple-400 hover:text-purple-300">
                ← Back to Movie
              </Link>
            </div>
          </div>

          {/* Streaming Options */}
          {subscription.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-3xl">📺</span> Stream with Subscription
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscription.map((item) => (
                  <StreamingCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {free.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-3xl">🆓</span> Watch Free
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {free.map((item) => (
                  <StreamingCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {rent.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-3xl">💰</span> Rent
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rent.map((item) => (
                  <StreamingCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {buy.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-3xl">🛒</span> Buy
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buy.map((item) => (
                  <StreamingCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Price Alert */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Set Price Alert</h3>
            <p className="text-gray-300 mb-4">Get notified when the price drops below your target</p>
            {!showAlert ? (
              <button
                onClick={() => setShowAlert(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Set Alert
              </button>
            ) : (
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Target price (₹)"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSetAlert}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAlert(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Platforms Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Where to Watch
          </h1>
          <p className="text-gray-300 text-xl">Stream your favorite movies on these platforms</p>
        </div>

        {/* Platforms Grid - 3 columns for better balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {platforms.map((platform) => {
            const logoMap = {
              'Netflix': '/logos/netflix.png',
              'Amazon Prime Video': '/logos/prime.png',
              'Disney+ Hotstar': '/logos/hotstar.png',
              'SonyLIV': '/logos/sonyliv.jpg',
              'Zee5': '/logos/zee5.png',
              'Eros Now': '/logos/erosnow.png',
              'YouTube': '/logos/youtube.png',
              'Apple TV+': '/logos/appletv.png',
              'Jio Cinema': '/logos/jiocinema.png'
            };
            
            return (
              <div
                key={platform.id}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-700/50 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/50"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-3xl transition-all duration-500"></div>
                
                <div className="relative flex flex-col items-center">
                  {/* Logo Container */}
                  <div className="w-32 h-32 mb-6 bg-white rounded-2xl flex items-center justify-center p-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                    <img 
                      src={logoMap[platform.name]}
                      alt={platform.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Platform Name */}
                  <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-purple-300 transition-colors">
                    {platform.name}
                  </h3>
                  
                  {/* Visit Button */}
                  <a
                    href={platform.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl text-center font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Visit Website →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">🎬 Stream Anywhere, Anytime</h3>
            <p className="text-gray-300 text-lg">
              Access thousands of movies and TV shows across multiple platforms. 
              Choose your favorite streaming service and start watching today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StreamingCard = ({ item }) => {
  const logoMap = {
    'Netflix': '/logos/netflix.png',
    'Amazon Prime Video': '/logos/prime.png',
    'Disney+ Hotstar': '/logos/hotstar.png',
    'SonyLIV': '/logos/sonyliv.jpg',
    'Zee5': '/logos/zee5.png',
    'Eros Now': '/logos/erosnow.png',
    'YouTube': '/logos/youtube.png',
    'Apple TV+': '/logos/appletv.png',
    'Jio Cinema': '/logos/jiocinema.png'
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-500/30 transition-all border border-gray-700 hover:border-purple-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
          <img 
            src={logoMap[item.platform_name]}
            alt={item.platform_name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{item.platform_name}</h3>
          <p className="text-sm text-gray-400">{item.quality}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-purple-400 font-semibold">
          {item.availability_type === 'Subscription' && `₹199/mo`}
          {item.price > 0 && item.availability_type !== 'Subscription' && `₹${item.price}`}
          {item.availability_type === 'Free' && 'Free'}
        </span>
        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
          {item.availability_type}
        </span>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-3 rounded-lg font-semibold transition-all"
      >
        Watch Now →
      </a>
    </div>
  );
};

export default StreamingGuide;
