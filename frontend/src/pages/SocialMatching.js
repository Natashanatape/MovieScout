import React from 'react';
import { Link } from 'react-router-dom';

const SocialMatching = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Social Matching</h1>
          <p className="text-purple-300 text-xl max-w-2xl mx-auto">
            Connect with friends and discover movies you'll all love together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Friend Recommendations</h3>
            <p className="text-purple-200 mb-6">Get movie suggestions based on what your friends loved. See their ratings and reviews to make better choices.</p>
            <Link to="/friends" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block">
              Find Friends
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Group Watchlists</h3>
            <p className="text-indigo-200 mb-6">Create shared watchlists with friends and family. Plan movie nights together and vote on what to watch next.</p>
            <Link to="/my-lists" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block">
              Create List
            </Link>
          </div>

          <div className="bg-gradient-to-br from-pink-800 to-pink-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Social Voting</h3>
            <p className="text-pink-200 mb-6">Vote on movies with your friend group. Let democracy decide your next movie night selection.</p>
            <Link to="/polls" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block">
              Join Polls
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMatching;