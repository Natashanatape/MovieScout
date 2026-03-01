import React, { useState, useEffect } from 'react';

const Trailers = ({ movieId }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [movieId]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/videos/movie/${movieId}`);
      const data = await response.json();
      setVideos(data);
      if (data.length > 0) {
        setSelectedVideo(data[0]);
        trackView(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (videoId) => {
    try {
      await fetch(`http://localhost:5001/api/videos/${videoId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchDuration: 0 })
      });
      const response = await fetch(`http://localhost:5001/api/videos/movie/${movieId}`);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    trackView(video.id);
  };

  const formatViews = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]+)/);
    return match ? match[1] : url;
  };

  if (loading) return null;
  if (videos.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bold text-white mb-6">Trailers & Videos</h2>
      
      {/* Main Video Player */}
      {selectedVideo && (
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.video_url)}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4">
            <h3 className="text-white text-xl font-bold mb-2">{selectedVideo.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="capitalize">{selectedVideo.video_type.replace('_', ' ')}</span>
              <span>•</span>
              <span>{formatViews(selectedVideo.views_count)} views</span>
            </div>
          </div>
        </div>
      )}

      {/* More Videos Grid */}
      {videos.length > 1 && (
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">More Videos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all transform hover:scale-105 ${
                  selectedVideo?.id === video.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeId(video.video_url)}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/320x180/1f2937/9ca3af?text=Video';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-purple-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-white">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-semibold line-clamp-2 mb-2">{video.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="capitalize">{video.video_type.replace('_', ' ')}</span>
                    <span className="font-semibold">{formatViews(video.views_count)} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Trailers;
