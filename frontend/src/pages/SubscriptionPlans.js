import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
    checkCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      console.log('Fetching plans...');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pro/plans`);
      console.log('Plans received:', response.data);
      setPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      alert('Error loading plans: ' + error.message);
      setLoading(false);
    }
  };

  const checkCurrentSubscription = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pro/subscription/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSubscription(response.data.subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = (planId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/payment?plan=${planId}`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">MovieScout Pro</h1>
        <p className="text-gray-400 text-center mb-12">Unlock premium features and insights</p>

        {currentSubscription && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-8">
            <p className="text-center">
              ✓ You have an active {currentSubscription.name} subscription
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 flex flex-col ${
                plan.name === 'Standard' ? 'border-yellow-500' : 'border-gray-700'
              }`}
            >
              {plan.name === 'Standard' && (
                <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Ad-free experience</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Unlimited watchlist</span>
                </li>
                {plan.features?.contacts !== false && (
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Early access to new releases</span>
                  </li>
                )}
                {plan.features?.analytics && (
                  <>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Personalized recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Exclusive content & trailers</span>
                    </li>
                  </>
                )}
                {plan.features?.priority_support && (
                  <>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Download movies offline</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Priority customer support</span>
                    </li>
                  </>
                )}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={currentSubscription}
                className={`w-full py-3 rounded-lg font-semibold mt-auto ${
                  currentSubscription
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                }`}
              >
                {currentSubscription ? 'Already Subscribed' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>All plans include a 7-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
