import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestVideoViews = () => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/videos/movie/6');
      setVideos(response.data);
      if (response.data.length === 0) {
        setMessage('No videos found for this movie');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const testView = async (videoId) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/videos/${videoId}/view`, {
        watchDuration: 10
      });
      setMessage(`View tracked! Total views: ${response.data.views}`);
      fetchVideos();
    } catch (error) {
      setMessage('Error: ' + error.message);
      console.log('Full error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Video Views Test</h1>
      
      {message && (
        <div className="bg-blue-600 p-4 rounded mb-6">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map(video => (
          <div key={video.id} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{video.title}</h3>
            <p className="text-gray-400 mb-4">
              {video.views_count || 0} views
            </p>
            <button
              onClick={() => testView(video.id)}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Play & Track View
            </button>
          </div>
        ))}
      </div>

      {videos.length === 0 && !message && (
        <p className="text-gray-400">Loading videos...</p>
      )}
    </div>
  );
};

export default TestVideoViews;
