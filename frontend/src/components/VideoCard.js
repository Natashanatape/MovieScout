import React from 'react';

const VideoCard = ({ video, onClick }) => {
  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count || 0;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={() => onClick(video)}
      className="cursor-pointer group"
    >
      <div className="relative rounded-lg overflow-hidden bg-gray-800">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <div className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity">
            ▶️
          </div>
          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs font-bold">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="mt-3">
        <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
          <span>👁️ {formatViews(video.views_count)} views</span>
          {video.video_type && (
            <>
              <span>•</span>
              <span className="capitalize">{video.video_type}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
