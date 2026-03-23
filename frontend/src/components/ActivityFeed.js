import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/activities/feed', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setActivities(res.data.activities || []);
    } catch (error) {
      console.error('Error:', error);
      // Sample data when API fails
      setActivities([
        { id: 1, username: 'John', activity_type: 'rating', movie_id: 1, movie_title: 'The Shawshank Redemption' },
        { id: 2, username: 'Sarah', activity_type: 'review', movie_id: 2, movie_title: 'The Godfather' },
        { id: 3, username: 'Mike', activity_type: 'watchlist', movie_id: 3, movie_title: 'The Dark Knight' },
        { id: 4, username: 'Emma', activity_type: 'rating', movie_id: 4, movie_title: 'Pulp Fiction' },
        { id: 5, username: 'Alex', activity_type: 'review', movie_id: 5, movie_title: 'Forrest Gump' }
      ]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No recent activity</p>
            <p className="text-gray-500 text-sm mt-2">Start rating movies to see activity!</p>
          </div>
        ) : (
          activities.slice(0, 5).map(activity => (
            <div key={activity.id} className="text-sm text-gray-300 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <span className="font-semibold text-purple-400">{activity.username}</span>
              {activity.activity_type === 'rating' && ' rated '}
              {activity.activity_type === 'review' && ' reviewed '}
              {activity.activity_type === 'watchlist' && ' added to watchlist '}
              <Link to={`/movie/${activity.movie_id}`} className="text-white hover:text-purple-400 font-medium">
                {activity.movie_title}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
