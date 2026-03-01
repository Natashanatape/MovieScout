import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-purple-400 font-bold text-xl mb-4">MovieScout</h3>
            <p className="text-sm">
              Your ultimate movie discovery platform.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400">Home</Link></li>
              <li><Link to="/search" className="hover:text-purple-400">Search</Link></li>
              <li><Link to="/watchlist" className="hover:text-purple-400">Watchlist</Link></li>
              <li><Link to="/profile" className="hover:text-purple-400">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/movies/genre/action" className="hover:text-purple-400">Action</Link></li>
              <li><Link to="/movies/genre/drama" className="hover:text-purple-400">Drama</Link></li>
              <li><Link to="/movies/genre/comedy" className="hover:text-purple-400">Comedy</Link></li>
              <li><Link to="/movies/genre/thriller" className="hover:text-purple-400">Thriller</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">More</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tv-shows" className="hover:text-purple-400">TV Shows</Link></li>
              <li><Link to="/coming-soon" className="hover:text-purple-400">Coming Soon</Link></li>
              <li><Link to="/box-office" className="hover:text-purple-400">Box Office</Link></li>
              <li><Link to="/celebrities" className="hover:text-purple-400">Celebrities</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-400">Facebook</a>
              <a href="#" className="hover:text-purple-400">Twitter</a>
              <a href="#" className="hover:text-purple-400">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 MovieScout. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2">Images from Unsplash | Movie data from TMDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
