import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔑 AUTH API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// 🎬 MOVIE API (FIXED)
export const movieAPI = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),
  search: (query) => api.get('/movies/search', { params: { q: query } }),

  // 🔥 IMPORTANT FIX
  getPopular: () => api.get('/movies'),

  getTrending: () => api.get('/movies'), // temporary same endpoint
  getByGenre: (genre) => api.get(`/movies`), // optional (backend me nahi hai abhi)
};

// ⭐ RATINGS
export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getUserRating: (movieId) => api.get(`/ratings/movie/${movieId}`),
};

// 📝 REVIEWS
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByMovie: (movieId) => api.get(`/reviews/movie/${movieId}`),
  getByUser: () => api.get('/reviews/user'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  vote: (id, voteType) => api.post(`/reviews/${id}/vote`, { vote_type: voteType }),
};

// 📌 WATCHLIST
export const watchlistAPI = {
  add: (movieId) => api.post('/watchlist', { movie_id: movieId }),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
  getAll: () => api.get('/watchlist'),
  check: (movieId) => api.get(`/watchlist/check/${movieId}`),
};

// 👤 CELEBRITY (optional, may not work fully)
export const celebrityAPI = {
  getAll: () => api.get('/celebrities'),
  getById: (id) => api.get(`/celebrities/${id}`),
};

// 🔍 ADVANCED SEARCH (optional)
export const advancedSearchAPI = {
  search: () => api.get('/movies'),
};

export default api;
export const videoAPI = {
  getFeatured: (params) => api.get('/videos/featured', { params }),
  getLatest: (params) => api.get('/videos/latest', { params }),
  getByMovie: (movieId, params) => api.get(`/videos/movie/${movieId}`, { params }),
};