import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=300&fit=crop" 
            alt="404" 
            className="w-64 h-64 mx-auto rounded-lg opacity-50"
          />
        </div>
        <h1 className="text-9xl font-bold text-purple-400 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-purple-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
