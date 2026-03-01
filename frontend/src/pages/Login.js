import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-purple-500/30">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-xl mb-4 animate-slideUp">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm">
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
            Sign up
          </Link>
        </p>

        <div className="text-center mt-4 pt-4 border-t border-gray-700">
          <Link to="/admin/login" className="text-red-400 hover:text-red-300 transition-colors duration-300 text-sm">
            🔐 Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
