import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
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
    dispatch(register(formData)).then((result) => {
      if (result.type === 'auth/register/fulfilled') {
        // Show success message
        alert('Registration successful! Please check your email to verify your account.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-purple-500/30">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Sign Up</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-xl mb-4 animate-slideUp">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>

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
              minLength="6"
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
