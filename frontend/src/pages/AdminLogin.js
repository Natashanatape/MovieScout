import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await dispatch(login(formData)).unwrap();
      
      if (result.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-white">
            🔐 Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Authorized access only
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Admin Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Admin Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Admin Login'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
              ← Back to User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
