import React from 'react';
import { Link } from 'react-router-dom';

const AIRecommendations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">AI Powered Recommendations</h1>
          <p className="text-indigo-300 text-xl max-w-2xl mx-auto">
            Let our advanced AI find the perfect movies tailored just for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Personalized Picks</h3>
            <p className="text-blue-200 mb-6">Our AI analyzes your viewing history, ratings, and preferences to suggest movies you'll absolutely love.</p>
            <Link to="/trending" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
              View Recommendations
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Smart Analytics</h3>
            <p className="text-green-200 mb-6">Deep learning algorithms study your behavior patterns to understand your taste and improve suggestions over time.</p>
            <Link to="/profile" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block">
              View Profile
            </Link>
          </div>

          <div className="bg-gradient-to-br from-yellow-800 to-yellow-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Instant Suggestions</h3>
            <p className="text-yellow-200 mb-6">Get real-time movie recommendations as you browse. The more you interact, the smarter our suggestions become.</p>
            <Link to="/search" className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors inline-block">
              Start Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;