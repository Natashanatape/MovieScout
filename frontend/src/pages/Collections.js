import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/collections');
      setCollections(res.data.collections || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">📚 Movie Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <Link
              key={collection.id}
              to={`/collection/${collection.id}`}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{collection.name}</h3>
              <p className="text-gray-400">{collection.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
