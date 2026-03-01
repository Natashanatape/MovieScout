import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaClock, FaCalendar } from 'react-icons/fa';

const TVShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowDetails();
    fetchVideos();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies/${id}`);
      setShow(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/videos/movie/${id}`);
      setVideos(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">TV Show not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Show Header */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 flex-shrink-0">
              {show.poster_url ? (
                <img src={show.poster_url} alt={show.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-96 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No Poster</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{show.title}</h1>
              <p className="text-gray-300 mb-4">{show.description}</p>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-white font-semibold">{show.average_rating || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-purple-400" />
                  <span className="text-white">{show.runtime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-blue-400" />
                  <span className="text-white">{new Date(show.release_date).getFullYear()}</span>
                </div>
              </div>
              <Link to="/tv-shows" className="text-purple-400 hover:text-purple-300">
                ← Back to TV Shows
              </Link>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Videos & Trailers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.slice(0, 6).map((video) => {
                const videoId = video.video_url?.includes('youtube.com') 
                  ? new URL(video.video_url).searchParams.get('v')
                  : video.video_url?.split('/').pop();
                return (
                  <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition">
                    <div className="relative aspect-video bg-gray-700">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm">{video.title}</p>
                      <p className="text-gray-400 text-xs">{video.video_type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowDetail;
