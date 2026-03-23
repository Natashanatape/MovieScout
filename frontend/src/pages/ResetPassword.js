import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import Toast from '../components/Toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, password);
      setToast({ message: 'Password reset successful!', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Failed to reset password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 disabled:opacity-50 transition"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
