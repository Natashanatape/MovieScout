import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [analyticsRes, subRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/pro/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/pro/subscription/current`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAnalytics(analyticsRes.data);
      setSubscription(subRes.data.subscription);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Pro subscription required');
        navigate('/pro/plans');
      }
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pro/subscription/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Subscription cancelled successfully');
      navigate('/');
    } catch (error) {
      alert('Failed to cancel subscription');
    }
  };

  const handleExportData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pro/analytics/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moviescout-analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      alert('Failed to export data');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pro Dashboard</h1>
            {subscription && (
              <p className="text-gray-400">
                {subscription.name} • Active until {new Date(subscription.end_date).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Export Data
            </button>
            <button
              onClick={handleCancelSubscription}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {analytics && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Profile Views"
                value={analytics.profileViews}
                icon="👁️"
                color="blue"
              />
              <StatCard
                title="Content Views"
                value={analytics.contentViews}
                icon="📊"
                color="green"
              />
              <StatCard
                title="Ratings Given"
                value={analytics.ratingsGiven}
                icon="⭐"
                color="yellow"
              />
              <StatCard
                title="Reviews Written"
                value={analytics.reviewsWritten}
                icon="✍️"
                color="purple"
              />
              <StatCard
                title="Watchlist Items"
                value={analytics.watchlistCount}
                icon="📝"
                color="pink"
              />
              <StatCard
                title="Total Activity"
                value={analytics.profileViews + analytics.contentViews}
                icon="🔥"
                color="red"
              />
            </div>

            {/* Recent Activity Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity (Last 30 Days)</h2>
              <div className="space-y-2">
                {analytics.recentActivity.slice(0, 10).map((day, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-400 w-32">{day.date}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full"
                        style={{ width: `${(day.count / 50) * 100}%` }}
                      />
                    </div>
                    <span className="ml-4 font-semibold">{day.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    yellow: 'from-yellow-600 to-yellow-800',
    purple: 'from-purple-600 to-purple-800',
    pink: 'from-pink-600 to-pink-800',
    red: 'from-red-600 to-red-800'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
};

export default ProDashboard;
