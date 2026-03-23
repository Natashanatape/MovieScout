import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StreamingBadge = ({ movieId }) => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreaming();
  }, [movieId]);

  const fetchStreaming = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/streaming/movie/${movieId}`);
      setPlatforms(res.data.platforms || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || platforms.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6">
      <h3 className="text-2xl font-bold text-white mb-4">📺 Where to Watch</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map(platform => (
          <a
            key={platform.id}
            href={platform.stream_url || platform.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {platform.name === 'Netflix' && '🔴'}
                {platform.name === 'Amazon Prime Video' && '📦'}
                {platform.name === 'Disney+ Hotstar' && '⭐'}
                {platform.name === 'Zee5' && '🎬'}
                {platform.name === 'SonyLIV' && '📺'}
                {platform.name === 'Apple TV+' && '🍎'}
                {platform.name === 'YouTube' && '▶️'}
              </div>
              <p className="text-white font-semibold text-sm">{platform.name}</p>
              {platform.type === 'subscription' && (
                <span className="text-xs text-green-400">Subscription</span>
              )}
              {platform.price && (
                <span className="text-xs text-yellow-400">
                  {platform.currency} {platform.price}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default StreamingBadge;
