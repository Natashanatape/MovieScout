const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const runMigrations = require('./database/runMigrations');
const { initReminderJobs } = require('./utils/reminderCron');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const ratingRoutes = require('./routes/ratings');
const reviewRoutes = require('./routes/reviews');
const watchlistRoutes = require('./routes/watchlist');
const userRoutes = require('./routes/users');
const videoRoutes = require('./routes/videos');
const celebrityRoutes = require('./routes/celebrities');
const advancedSearchRoutes = require('./routes/advancedSearch');
const streamingRoutes = require('./routes/streaming');
const recommendationRoutes = require('./routes/recommendations');
const collectionRoutes = require('./routes/collections');
const photoRoutes = require('./routes/photos');
const newsRoutes = require('./routes/news');
const contributionRoutes = require('./routes/contributions');
const commentRoutes = require('./routes/comments');
const socialRoutes = require('./routes/social');
const notificationRoutes = require('./routes/notifications');
const pollRoutes = require('./routes/polls');
const quizRoutes = require('./routes/quizzes');
const awardRoutes = require('./routes/awards');
const miscRoutes = require('./routes/misc');
const phase4Routes = require('./routes/phase4');
const proRoutes = require('./routes/pro');
const adminRoutes = require('./routes/admin');
const activitiesRoutes = require('./routes/activities');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'IMDB API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/celebrities', celebrityRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/search', advancedSearchRoutes);
app.use('/api/streaming', streamingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/phase4', phase4Routes);
app.use('/api/pro', proRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activities', activitiesRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve static images with proper headers
app.use('/images', express.static('public/images', {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Run migrations on startup
runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Initialize cron jobs
    initReminderJobs();
    console.log('⏰ Reminder cron jobs initialized');
  });
});

module.exports = app;
