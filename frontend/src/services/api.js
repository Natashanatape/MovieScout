import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const movieAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  search: (query) => api.get('/movies/search', { params: { q: query } }),
  getTrending: (params) => api.get('/movies/trending', { params }),
  getPopular: (params) => api.get('/movies/popular', { params }),
  getByGenre: (genre, params) => api.get(`/movies/genre/${genre}`, { params }),
};

export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getUserRating: (movieId) => api.get(`/ratings/movie/${movieId}`),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByMovie: (movieId, params) => api.get(`/reviews/movie/${movieId}`, { params }),
  getByUser: () => api.get('/reviews/user'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  vote: (id, voteType) => api.post(`/reviews/${id}/vote`, { vote_type: voteType }),
};

export const watchlistAPI = {
  add: (movieId) => api.post('/watchlist', { movie_id: movieId }),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
  getAll: () => api.get('/watchlist'),
  check: (movieId) => api.get(`/watchlist/check/${movieId}`),
};

export const celebrityAPI = {
  getAll: (params) => api.get('/celebrities', { params }),
  getById: (id) => api.get(`/celebrities/${id}`),
  search: (query) => api.get('/celebrities/search', { params: { q: query } }),
  getPopular: (params) => api.get('/celebrities/popular', { params }),
  getBornToday: () => api.get('/celebrities/born-today'),
  getFilmography: (id, params) => api.get(`/celebrities/${id}/filmography`, { params }),
};

export const videoAPI = {
  getFeatured: (params) => axios.get('http://localhost:5001/api/videos/featured', { params }),
  getLatest: (params) => axios.get('http://localhost:5001/api/videos/latest', { params }),
  getByMovie: (movieId, params) => axios.get(`http://localhost:5001/api/videos/movie/${movieId}`, { params }),
  getByType: (type, params) => axios.get(`http://localhost:5001/api/videos/type/${type}`, { params }),
  getById: (id) => axios.get(`http://localhost:5001/api/videos/${id}`),
  search: (query) => axios.get('http://localhost:5001/api/videos/search', { params: { q: query } }),
  getStats: () => axios.get('http://localhost:5001/api/videos/stats'),
};

export const advancedSearchAPI = {
  search: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value.length !== 0) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    return api.get(`/search/advanced?${params.toString()}`);
  },
  getFilterOptions: () => api.get('/search/filters'),
  saveSearch: (data) => api.post('/search/save', data),
  getSearchHistory: () => api.get('/search/history'),
};

export default api;
