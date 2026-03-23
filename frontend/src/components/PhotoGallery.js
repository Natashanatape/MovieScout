import React, { useState, useEffect } from 'react';

const PhotoGallery = ({ movieId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPhotos();
  }, [movieId, filter]);

  const fetchPhotos = async () => {
    try {
      const url = filter === 'all' 
        ? `http://localhost:5001/api/photos/movie/${movieId}`
        : `http://localhost:5001/api/photos/movie/${movieId}?category=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Photos' },
    { value: 'poster', label: 'Posters' },
    { value: 'still', label: 'Stills' },
    { value: 'behind_scenes', label: 'Behind the Scenes' }
  ];

  if (loading) return <div className="text-white">Loading photos...</div>;
  if (photos.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">📸 Photo Gallery</h2>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === cat.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative group cursor-pointer rounded-lg overflow-hidden aspect-video bg-gray-800"
          >
            <img
              src={photo.photo_url}
              alt={photo.caption || 'Movie photo'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <p className="text-white text-sm">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>
          <div className="max-w-5xl max-h-screen" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.photo_url}
              alt={selectedPhoto.caption || 'Movie photo'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-4 text-lg">{selectedPhoto.caption}</p>
            )}
            <p className="text-gray-400 text-center mt-2 capitalize">
              {selectedPhoto.category.replace('_', ' ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
