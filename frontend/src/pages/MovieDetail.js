import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { movieAPI, watchlistAPI, ratingAPI, reviewAPI } from '../services/api';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import { MovieDetailSkeleton } from '../components/Skeleton';
import Toast from '../components/Toast';
import StreamingBadge from '../components/StreamingBadge';
import SimilarMovies from '../components/SimilarMovies';
import VideoPlayer from '../components/VideoPlayer';
import Trailers from '../components/Trailers';
import PhotoGallery from '../components/PhotoGallery';
import MovieTrivia from '../components/MovieTrivia';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMovie();
    fetchReviews();
    if (user) {
      checkWatchlist();
      fetchUserRating();
    }
  }, [id, user]);

  const fetchMovie = async () => {
    try {
      const response = await movieAPI.getById(id);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlist = async () => {
    try {
      const response = await watchlistAPI.check(id);
      setInWatchlist(response.data.inWatchlist);
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await ratingAPI.getUserRating(id);
      if (response.data.rating) {
        setUserRating(response.data.rating);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleRate = async (rating) => {
    if (!user) {
      setToast({ message: 'Please login to rate', type: 'warning' });
      return;
    }

    try {
      await ratingAPI.create({ movie_id: id, rating });
      setUserRating(rating);
      setShowRating(false);
      setToast({ message: 'Rating submitted successfully!', type: 'success' });
      fetchMovie();
    } catch (error) {
      console.error('Error rating movie:', error);
      setToast({ message: 'Failed to submit rating', type: 'error' });
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getByMovie(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await reviewAPI.create(reviewData);
      setShowReviewForm(false);
      fetchReviews();
      setToast({ message: 'Review submitted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({ message: 'Failed to submit review', type: 'error' });
      throw error;
    }
  };

  const handleReviewVote = async (reviewId, voteType) => {
    if (!user) {
      setToast({ message: 'Please login to vote', type: 'warning' });
      return;
    }

    try {
      await reviewAPI.vote(reviewId, voteType);
      setToast({ message: 'Vote recorded!', type: 'success' });
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error voting:', error);
      setToast({ message: 'Failed to vote', type: 'error' });
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      setToast({ message: 'Please login to add to watchlist', type: 'warning' });
      return;
    }

    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await watchlistAPI.remove(id);
        setInWatchlist(false);
        setToast({ message: 'Removed from watchlist', type: 'success' });
      } else {
        await watchlistAPI.add(id);
        setInWatchlist(true);
        setToast({ message: 'Added to watchlist', type: 'success' });
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setToast({ message: 'Failed to update watchlist', type: 'error' });
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white text-2xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white pb-12">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: '70vh', minHeight: '400px', maxHeight: '600px' }}>
        {/* Background Image - Using poster which already loads */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
          style={{
            backgroundImage: `url(${movie.poster_url})`
          }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-lg">
              <span className="bg-purple-600 px-4 py-2 rounded-full font-semibold">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-200">{movie.runtime} minutes</span>
              {movie.average_rating && movie.average_rating > 0 && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold">
                    <span className="text-2xl mr-2">★</span>
                    <span>{Number(movie.average_rating).toFixed(1)}</span>
                  </div>
                </>
              )}
              {movie.views_count && movie.views_count > 0 && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full font-bold">
                    <span className="text-2xl mr-2">👁</span>
                    <span>{movie.views_count.toLocaleString()} views</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl sticky top-4 transform transition-all duration-300 hover:shadow-purple-500/30">
              <div className="relative overflow-hidden rounded-xl mb-6 group">
                <img
                  src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop'}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full rounded-xl shadow-lg transform transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <button 
                onClick={toggleWatchlist}
                disabled={watchlistLoading}
                className={`w-full font-bold py-4 rounded-xl transition-all duration-300 mb-3 shadow-lg transform hover:scale-105 ${
                  inWatchlist 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {watchlistLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </span>
                ) : inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              
              <button 
                onClick={() => setShowRating(!showRating)}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                {userRating > 0 ? `Your Rating: ${userRating}/10` : 'Rate Movie'}
              </button>

              {showRating && (
                <div className="mt-4 p-4 bg-gray-700 rounded-xl animate-fadeIn">
                  <p className="text-white mb-3 text-center font-semibold">Rate this movie:</p>
                  <StarRating rating={userRating} onRate={handleRate} size="md" />
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* Overview */}
            <section className="mb-10 bg-gray-800 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:shadow-purple-500/20">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-purple-400">Overview</h2>
                <VideoPlayer videoId="dQw4w9WgXcQ" title={movie.title} />
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">{movie.description}</p>
              
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">Genres</h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold transform transition-all duration-300 hover:scale-110 hover:bg-purple-500 cursor-pointer">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-xl p-5 transform transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Release Date</p>
                  <p className="text-white font-bold text-lg">{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-5 transform transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Runtime</p>
                  <p className="text-white font-bold text-lg">{movie.runtime} min</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-5 transform transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Average Rating</p>
                  <p className="text-white font-bold text-lg">
                    {movie.average_rating && movie.average_rating > 0 ? `${Number(movie.average_rating).toFixed(1)} / 10` : 'Not rated yet'}
                  </p>
                </div>
              </div>
            </section>

            {/* Streaming Availability */}
            <StreamingBadge movieId={id} />

            {/* Trailers & Videos */}
            <Trailers movieId={id} />

            {/* Photo Gallery */}
            <PhotoGallery movieId={id} />

            {/* Movie Trivia */}
            <div className="mb-10">
              <MovieTrivia movieId={id} />
            </div>

            {/* Similar Movies */}
            <SimilarMovies movieId={id} />

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <section className="mb-10 bg-gray-800 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:shadow-purple-500/20">
                <h2 className="text-3xl font-bold mb-6 text-purple-400">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.cast.slice(0, 8).map((actor, index) => (
                    <div key={actor.id || index} className="bg-gray-700 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-600 cursor-pointer">
                      <p className="font-bold text-white mb-1">{actor.name || actor.character_name}</p>
                      <p className="text-sm text-gray-400">{actor.character || actor.role || 'Actor'}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="mb-10 bg-gray-800 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:shadow-purple-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-purple-400">User Reviews ({reviews.length})</h2>
                {user && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    + Write Review
                  </button>
                )}
                {!user && (
                  <button
                    onClick={() => setToast({ message: 'Please login to write a review', type: 'warning' })}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-500 transition-all duration-300 shadow-lg"
                  >
                    Login to Review
                  </button>
                )}
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-700 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-650">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white text-lg">{review.username || 'Anonymous'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 font-bold">★ {review.rating}/10</span>
                          <span className="text-gray-400 text-sm">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">{review.review_text}</p>
                      
                      {/* Vote buttons */}
                      {user && (
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleReviewVote(review.id, 'helpful')}
                            className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-110"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>Helpful ({review.helpful_count || 0})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-400 text-lg mb-4">No reviews yet</p>
                  <p className="text-gray-500">Be the first to review this {movie.type === 'tv_show' ? 'show' : 'movie'}!</p>
                </div>
              )}
            </section>

            {/* Review Form */}
            {showReviewForm && (
              <section className="mb-10">
                <ReviewForm 
                  movieId={id} 
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                />
              </section>
            )}

            {user && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-600 transition-all duration-300 shadow-lg text-lg transform hover:scale-105"
              >
                Write a Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
