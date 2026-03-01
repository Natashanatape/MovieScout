import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition">
              MovieScout
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/tv-shows" className="hover:text-purple-300 transition">TV Shows</Link>
              <Link to="/trending" className="hover:text-purple-300 transition">Trending</Link>
              <Link to="/celebrities" className="hover:text-purple-300 transition">Celebrities</Link>
              <Link to="/streaming" className="hover:text-purple-300 transition">Streaming</Link>
              <Link to="/pro/plans" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">Pro</Link>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-purple-800 bg-opacity-50 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </form>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/watchlist" className="hover:text-purple-300 transition">Watchlist</Link>
                <Link to="/my-lists" className="hover:text-purple-300 transition">My Lists</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-red-400 hover:text-red-300 transition font-semibold">Admin</Link>
                )}
                <Link to="/profile" className="hover:text-purple-300 transition">{user.username}</Link>
                <button onClick={handleLogout} className="hover:text-purple-300 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-300 transition">Login</Link>
                <Link to="/register" className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
