import React from 'react';
import { Link } from 'react-router-dom';

const SwipeDiscover = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Swipe to Discover</h1>
          <p className="text-pink-300 text-xl max-w-2xl mx-auto">
            Find your next favorite movie with our fun, Tinder-style discovery experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Like & Dislike</h3>
            <p className="text-red-200 mb-6">Swipe right to like movies you want to watch, left to pass. Build your taste profile with every swipe.</p>
            <Link to="/popular" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block">
              Start Swiping
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Quick Discovery</h3>
            <p className="text-purple-200 mb-6">The fastest way to discover new movies. No endless scrolling - just quick decisions and instant results.</p>
            <Link to="/trending" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block">
              Discover Now
            </Link>
          </div>

          <div className="bg-gradient-to-br from-orange-800 to-orange-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Random Mode</h3>
            <p className="text-orange-200 mb-6">Feeling adventurous? Let our random picker surprise you with hidden gems and unexpected favorites.</p>
            <Link to="/genre/Action" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors inline-block">
              Surprise Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeDiscover;