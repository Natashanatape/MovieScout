import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import { getMe } from './store/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import Trending from './pages/Trending';
import Popular from './pages/Popular';
import GenreMovies from './pages/GenreMovies';
import Videos from './pages/Videos';
import Celebrities from './pages/Celebrities';
import CelebrityProfile from './pages/CelebrityProfile';
import AdvancedSearch from './pages/AdvancedSearch';
import TVShows from './pages/TVShows';
import TVShowDetail from './pages/TVShowDetail';
import MyLists from './pages/MyLists';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Notifications from './pages/Notifications';
import Polls from './pages/Polls';
import Quizzes from './pages/Quizzes';
import SocialFeed from './pages/SocialFeed';
import SocialMatching from './pages/SocialMatching';
import AIRecommendations from './pages/AIRecommendations';
import SwipeDiscover from './pages/SwipeDiscover';
import TestVideoViews from './pages/TestVideoViews';
import ComingSoon from './pages/ComingSoon';
import BoxOffice from './pages/BoxOffice';
import StreamingGuide from './pages/StreamingGuide';
import SubscriptionPlans from './pages/SubscriptionPlans';
import ProDashboard from './pages/ProDashboard';
import Billing from './pages/Billing';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import { Awards, BornToday, MostPopular } from './pages/SpecialPages';
import NotFound from './pages/NotFound';
import './index.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
            <Route path="/celebrities" element={<Celebrities />} />
            <Route path="/celebrity/:id" element={<CelebrityProfile />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/new-releases" element={<Home />} />
            <Route path="/highlights" element={<Home />} />
            <Route path="/top-2026" element={<Home />} />
            <Route path="/hidden-gems" element={<Home />} />
            <Route path="/movies" element={<Popular />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/genre/:genre" element={<GenreMovies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/tv/:id" element={<TVShowDetail />} />
            <Route path="/my-lists" element={<MyLists />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/feed" element={<SocialFeed />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/born-today" element={<BornToday />} />
            <Route path="/most-popular" element={<MostPopular />} />
            <Route path="/social-matching" element={<SocialMatching />} />
            <Route path="/ai-recommendations" element={<AIRecommendations />} />
            <Route path="/swipe-discover" element={<SwipeDiscover />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/box-office" element={<BoxOffice />} />
            <Route path="/streaming" element={<StreamingGuide />} />
            <Route path="/streaming/:id" element={<StreamingGuide />} />
            <Route path="/pro/plans" element={<SubscriptionPlans />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/pro/dashboard" element={<ProDashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/test-views" element={<TestVideoViews />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
