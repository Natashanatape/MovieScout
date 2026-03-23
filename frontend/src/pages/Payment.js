import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const navigate = useNavigate();
  const planId = searchParams.get('plan');

  useEffect(() => {
    if (!planId) {
      navigate('/pro/plans');
      return;
    }
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pro/plans`);
      const selectedPlan = response.data.find(p => p.id === parseInt(planId));
      setPlan(selectedPlan);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      navigate('/pro/plans');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pro/subscribe`,
        { plan_id: planId, payment_method: 'card' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Payment successful! Subscription activated.');
        navigate('/pro/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed');
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="font-semibold">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span>{plan.duration_months === 1 ? '1 Month' : plan.duration_months === 12 ? '1 Year' : 'Lifetime'}</span>
              </div>
              <div className="border-t border-gray-700 pt-4 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-yellow-500">₹{plan.price}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Includes:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Pro Badge on Profile
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Contact Information Access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced Analytics Dashboard
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority Support
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    processing
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {processing ? 'Processing...' : `Pay ₹${plan.price}`}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                🔒 Secure payment • All prices in INR
              </p>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/pro/plans')}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
