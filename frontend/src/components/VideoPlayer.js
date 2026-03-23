import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoPlayer = ({ videoId, title, dbVideoId }) => {
  const [showModal, setShowModal] = useState(false);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (dbVideoId) {
      fetchViews();
    }
  }, [dbVideoId]);

  const fetchViews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/videos/${dbVideoId}/views`);
      setViews(response.data.views);
    } catch (error) {
      console.error('Error fetching views:', error);
    }
  };

  const trackView = async () => {
    if (!dbVideoId) return;
    try {
      const response = await axios.post(`http://localhost:5000/api/videos/${dbVideoId}/view`, {
        watchDuration: 0
      });
      setViews(response.data.views);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const handlePlay = () => {
    setShowModal(true);
    trackView();
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlay}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2"
        >
          ▶️ Watch Trailer
        </button>
        {dbVideoId && views > 0 && (
          <span className="text-gray-400 text-sm">
            👁️ {formatViews(views)} views
          </span>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-red-500"
            >
              ✕
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
