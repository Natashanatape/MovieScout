import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Billing = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');

  useEffect(() => {
    fetchBillingData();
    if (planId) {
      fetchPlanDetails(planId);
    }
  }, [planId]);

  const fetchPlanDetails = async (id) => {
    try {
      const response = await axios.get('http://localhost:5000/api/pro/plans');
      const plan = response.data.find(p => p.id == id);
      setSelectedPlan(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  };

  const fetchBillingData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [paymentsRes, invoicesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/pro/payments', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/pro/invoices', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setPayments(paymentsRes.data);
      setInvoices(invoicesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/pro/subscribe',
        { 
          plan_id: selectedPlan.id, 
          payment_method: 'card',
          card_details: paymentForm
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Payment successful! Subscription activated.');
        navigate('/pro/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing & Payments</h1>

        {/* Payment Form for Selected Plan */}
        {selectedPlan && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Plan Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-lg">{selectedPlan.name}</h4>
                  <p className="text-2xl font-bold text-yellow-500 mt-2">
                    ${selectedPlan.price}
                    <span className="text-sm text-gray-400">
                      {selectedPlan.duration_months === 1 ? '/month' : '/year'}
                    </span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>✓ Pro Badge on Profile</li>
                    <li>✓ Contact Information Access</li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ Priority Support</li>
                  </ul>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentForm.cardholderName}
                      onChange={(e) => setPaymentForm({...paymentForm, cardholderName: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                        placeholder="123"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : `Pay $${selectedPlan.price}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-gray-400">No payment history</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Method</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-700">
                      <td className="py-3">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        ${payment.amount} {payment.currency}
                      </td>
                      <td className="py-3 capitalize">{payment.payment_method}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            payment.status === 'completed'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-yellow-900 text-yellow-300'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Invoices</h2>
          {invoices.length === 0 ? (
            <p className="text-gray-400">No invoices</p>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
                >
                  <div>
                    <p className="font-semibold">{invoice.invoice_number}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${invoice.amount}</p>
                    <button className="text-sm text-yellow-500 hover:text-yellow-400">
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
