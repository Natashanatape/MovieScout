import React, { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVideos();
  }, [activeTab, searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      if (activeTab === 'featured') {
        const response = await videoAPI.getFeatured({ limit: 12 });
        console.log('Featured response:', response.data);
        setFeaturedVideos(response.data);
      } else if (activeTab === 'search' && searchQuery) {
        const response = await videoAPI.search(searchQuery);
        console.log('Search response:', response.data);
        setVideos(response.data.videos);
      } else if (activeTab !== 'featured') {
        const response = await videoAPI.getByType(activeTab);
        console.log('Type response:', response.data);
        setVideos(response.data.videos || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
    }
  };

  const VideoCard = ({ video, featured = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const formatViews = (count) => {
      if (!count) return '0';
      if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
      if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
      return count.toString();
    };
    
    return (
      <div 
        className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 border border-purple-500/20"
        onClick={() => setSelectedVideo(video)}
      >
        <div className="relative overflow-hidden rounded-t-xl">
          {!imageLoaded && (
            <div className="w-full h-56 bg-gray-700 animate-pulse" />
          )}
          <img
            src={video.thumbnail_url || 'https://images.unsplash.com/photo-1574267432644-f610a5c0c5e0?w=500&h=350&fit=crop'}
            alt={video.title}
            loading="lazy"
            className={`w-full h-56 object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1574267432644-f610a5c0c5e0?w=500&h=350&fit=crop';
              setImageLoaded(true);
            }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
            <div className="bg-red-500 rounded-full p-5 transform hover:scale-110 transition-transform duration-300 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* Video Type Badge */}
          <div className="absolute top-3 left-3 transform transition-all duration-300 hover:scale-110">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg uppercase ${
              video.video_type === 'trailer' ? 'bg-red-500 text-white' :
              video.video_type === 'behind_scenes' ? 'bg-blue-500 text-white' :
              video.video_type === 'interview' ? 'bg-green-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {video.video_type.replace('_', ' ')}
            </span>
          </div>

          {/* Duration */}
          {video.duration && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-black bg-opacity-80 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold">
                {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-white font-bold text-base mb-2 line-clamp-2 hover:text-purple-300 transition-colors duration-300">{video.title}</h3>
          <p className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-300">{video.movie_title}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <span>{formatViews(video.views_count)} views</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Videos & Trailers</h1>
          <p className="text-purple-300 text-lg">Watch trailers, behind-the-scenes, and exclusive content</p>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-purple-500/20">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="flex-1 px-6 py-4 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:border-purple-500 placeholder-gray-400 transition-all duration-300 text-lg"
            />
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
            >
              Search
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-purple-500/20">
            {['featured', 'trailer', 'behind_scenes', 'interview', 'clip'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab === 'featured' ? 'Featured' : 
                 tab === 'behind_scenes' ? 'Behind Scenes' :
                 tab === 'trailer' ? 'Trailers' :
                 tab === 'interview' ? 'Interviews' :
                 'Clips'}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl animate-pulse">
                <div className="h-56 bg-gray-700 rounded-t-xl"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {activeTab === 'featured' ? (
              featuredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">No featured videos found</h3>
                    <p className="text-gray-400">No featured videos available</p>
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    {activeTab === 'search' ? `Search Results for "${searchQuery}"` : 
                     activeTab === 'behind_scenes' ? 'Behind the Scenes' :
                     activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + 's'}
                  </h2>
                </div>
                
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
                      <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-2xl font-bold text-white mb-4">No videos found</h3>
                      <p className="text-gray-400">
                        {activeTab === 'search' 
                          ? `No videos found for "${searchQuery}"`
                          : `No ${activeTab} videos available`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
};

export default Videos;
