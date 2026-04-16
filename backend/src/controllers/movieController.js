const Movie = require('../models/Movie');
const redisClient = require('../config/redis');

class MovieController {
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 100, sortBy = 'created_at', order = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      const movies = await Movie.findAll({ limit: parseInt(limit), offset, sortBy, order });
      return res.json(movies);

    } catch (error) {
      console.error('Get movies error:', error);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      try {
        const movie = await Movie.getWithGenres(id);
        if (!movie) {
          throw new Error('Movie not found in database');
        }

        const [cast, reviews, stats, userRating, inWatchlist] = await Promise.all([
          Movie.getCast(id),
          Movie.getReviews(id, 5),
          Movie.getRatingStats(id),
          userId ? Movie.getUserRating(id, userId) : null,
          userId ? Movie.checkWatchlist(id, userId) : false
        ]);

        const result = {
          ...movie,
          cast,
          reviews,
          rating_stats: stats,
          user_rating: userRating,
          in_watchlist: inWatchlist
        };

        res.json(result);
      } catch (dbError) {
        console.log('Database error, returning sample movie:', dbError.message);
        
        const sampleMovies = {
          1: {
            id: 1,
            title: 'Dangal',
            description: 'Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers.',
            release_date: '2016-12-23',
            runtime: 161,
            poster_url: 'https://image.tmdb.org/t/p/w500/lWcAVj5GhOKjNJ9bKhz5NApkSVl.jpg',
            average_rating: 8.3,
            rating_count: 1200000,
            cast: [
              { id: 1, name: 'Aamir Khan', character: 'Mahavir Singh Phogat' },
              { id: 2, name: 'Fatima Sana Shaikh', character: 'Geeta Phogat' }
            ],
            reviews: []
          },
          2: {
            id: 2,
            title: 'Baahubali 2',
            description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers.',
            release_date: '2017-04-28',
            runtime: 167,
            poster_url: 'https://image.tmdb.org/t/p/w500/lWcAVj5GhOKjNJ9bKhz5NApkSVl.jpg',
            average_rating: 8.2,
            rating_count: 1500000,
            cast: [
              { id: 3, name: 'Prabhas', character: 'Baahubali' },
              { id: 4, name: 'Rana Daggubati', character: 'Bhallaladeva' }
            ],
            reviews: []
          },
          3: {
            id: 3,
            title: 'KGF Chapter 1',
            description: 'Rocky, whose name strikes fear in the heart of his foes.',
            release_date: '2018-12-21',
            runtime: 156,
            poster_url: 'https://image.tmdb.org/t/p/w500/sCSB71KdtqkHHWLbXWkb0xQvNQF.jpg',
            average_rating: 8.2,
            rating_count: 1100000,
            cast: [
              { id: 5, name: 'Yash', character: 'Rocky' },
              { id: 6, name: 'Srinidhi Shetty', character: 'Reena' }
            ],
            reviews: []
          },
          4: {
            id: 4,
            title: 'RRR',
            description: 'A fictional story about two legendary revolutionaries.',
            release_date: '2022-03-25',
            runtime: 187,
            poster_url: 'https://image.tmdb.org/t/p/w500/w7RDszvnvBDFLind6ovP5iXMNdz.jpg',
            average_rating: 8.0,
            rating_count: 900000,
            cast: [
              { id: 7, name: 'N.T. Rama Rao Jr.', character: 'Komaram Bheem' },
              { id: 8, name: 'Ram Charan', character: 'Alluri Sitarama Raju' }
            ],
            reviews: []
          },
          5: {
            id: 5,
            title: 'Pushpa',
            description: 'A laborer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling.',
            release_date: '2021-12-17',
            runtime: 179,
            poster_url: 'https://image.tmdb.org/t/p/w500/5RiKVZhf4VxlAhXKNyOlnhVGaKO.jpg',
            average_rating: 7.6,
            rating_count: 800000,
            cast: [
              { id: 9, name: 'Allu Arjun', character: 'Pushpa Raj' },
              { id: 10, name: 'Rashmika Mandanna', character: 'Srivalli' }
            ],
            reviews: []
          },
          6: {
            id: 6,
            title: 'Tumhari Sulu',
            description: 'A happy-go-lucky Mumbai suburban housewife Sulochana becomes the night RJ of a leading radio station.',
            release_date: '2017-11-17',
            runtime: 140,
            poster_url: 'https://image.tmdb.org/t/p/w500/kKOKFNGgvmU8VkBBKGlqjD4tQdA.jpg',
            average_rating: 7.1,
            rating_count: 600000,
            cast: [
              { id: 11, name: 'Vidya Balan', character: 'Sulochana' },
              { id: 12, name: 'Manav Kaul', character: 'Ashok' }
            ],
            reviews: []
          },
          7: {
            id: 7,
            title: 'Article 15',
            description: 'A young IPS officer investigates a case involving three missing girls.',
            release_date: '2019-06-28',
            runtime: 130,
            poster_url: 'https://image.tmdb.org/t/p/w500/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg',
            average_rating: 8.1,
            rating_count: 700000,
            cast: [
              { id: 13, name: 'Ayushmann Khurrana', character: 'Ayan Ranjan' },
              { id: 14, name: 'Isha Talwar', character: 'Aditi' }
            ],
            reviews: []
          },
          8: {
            id: 8,
            title: 'Super 30',
            description: 'Based on the life of Patna-based mathematician Anand Kumar.',
            release_date: '2019-07-12',
            runtime: 154,
            poster_url: 'https://image.tmdb.org/t/p/w500/oDUGOGKzOZAaFzYbqgWbs5dZQxu.jpg',
            average_rating: 7.9,
            rating_count: 650000,
            cast: [
              { id: 15, name: 'Hrithik Roshan', character: 'Anand Kumar' },
              { id: 16, name: 'Mrunal Thakur', character: 'Supriya' }
            ],
            reviews: []
          }
        };

        const movie = sampleMovies[id];
        if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(movie);
      }
    } catch (error) {
      console.error('Get movie error:', error);
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  }

  static async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query required' });
      }

      try {
        const movies = await Movie.search(q);
        res.json(movies);
      } catch (dbError) {
        console.log('Database error, searching in sample data:', dbError.message);
        
        const sampleMovies = [
          { id: 1, title: '3 Idiots', description: 'Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers.', release_date: '2016-12-23', runtime: 161, poster_url: '/images/3iditios.jpg', average_rating: 8.3, rating_count: 1200000 },
          { id: 2, title: 'Andhadhun', description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers.', release_date: '2017-04-28', runtime: 167, poster_url: '/images/Andhadhun.jpg', average_rating: 8.2, rating_count: 1500000 },
          { id: 3, title: 'Bajrangi Bhaijaan', description: 'Rocky, whose name strikes fear in the heart of his foes.', release_date: '2018-12-21', runtime: 156, poster_url: '/images/BajrangiBhaijaan.jpg', average_rating: 8.2, rating_count: 1100000 },
          { id: 4, title: 'Drishyam', description: 'A fictional story about two legendary revolutionaries.', release_date: '2022-03-25', runtime: 187, poster_url: '/images/Drishyam.jpg', average_rating: 8.0, rating_count: 900000 },
          { id: 5, title: 'Gully Boy', description: 'A laborer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling.', release_date: '2021-12-17', runtime: 179, poster_url: '/images/gullyboy.jpg', average_rating: 7.6, rating_count: 800000 },
          { id: 6, title: 'Zindagi Na Milegi Dobara', description: 'A happy-go-lucky Mumbai suburban housewife Sulochana becomes the night RJ of a leading radio station.', release_date: '2017-11-17', runtime: 140, poster_url: '/images/zindaginamilegidubara.jpg', average_rating: 7.1, rating_count: 600000 }
        ];

        const searchLower = q.toLowerCase();
        const filtered = sampleMovies.filter(movie => 
          movie.title.toLowerCase().includes(searchLower) ||
          movie.description.toLowerCase().includes(searchLower)
        );

        res.json(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  static async getTrending(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      try {
        const movies = await Movie.findAll({ 
          limit: parseInt(limit), 
          sortBy: 'rating_count', 
          order: 'DESC' 
        });
        
        if (movies && movies.length > 0) {
          return res.json(movies);
        }
      } catch (dbError) {
        console.log('Database error, returning sample trending data:', dbError.message);
      }
      
      // Sample trending movies
      const trendingMovies = [
        { id: 1, title: 'Spider-Man: No Way Home', description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.', release_date: '2021-12-17', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', average_rating: 8.2, rating_count: 2800000 },
        { id: 2, title: 'Avengers: Endgame', description: 'After the devastating events of Infinity War, the Avengers assemble once more.', release_date: '2019-04-26', runtime: 181, poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', average_rating: 8.4, rating_count: 2600000 },
        { id: 3, title: 'The Dark Knight', description: 'Batman raises the stakes in his war on crime.', release_date: '2008-07-18', runtime: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 9.0, rating_count: 2500000 },
        { id: 4, title: 'Inception', description: 'A thief who steals corporate secrets through dream-sharing technology.', release_date: '2010-07-16', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 8.8, rating_count: 2300000 }
      ];
      
      res.json(trendingMovies.slice(0, parseInt(limit)));
    } catch (error) {
      console.error('Get trending error:', error);
      res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
  }

  static async getPopular(req, res) {
    try {
      const { limit = 10, timeframe = 'all' } = req.query;
      console.log('🔥 Popular API called with timeframe:', timeframe);
      
      // All time popular - highest rated classics with unique posters
      const allMovies = [
        { id: 1, title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', release_date: '1994-09-23', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', average_rating: 9.3, rating_count: 2500000 },
        { id: 2, title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', release_date: '1972-03-24', runtime: 175, poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', average_rating: 9.2, rating_count: 1800000 },
        { id: 3, title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', release_date: '2008-07-18', runtime: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 9.0, rating_count: 2600000 },
        { id: 4, title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', release_date: '1994-10-14', runtime: 154, poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', average_rating: 8.9, rating_count: 2000000 },
        { id: 5, title: 'Forrest Gump', description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.', release_date: '1994-07-06', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', average_rating: 8.8, rating_count: 2100000 },
        { id: 6, title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', release_date: '2010-07-16', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 8.8, rating_count: 2300000 },
        { id: 7, title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', release_date: '1999-03-31', runtime: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', average_rating: 8.7, rating_count: 1900000 },
        { id: 8, title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', release_date: '2014-11-07', runtime: 169, poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', average_rating: 8.6, rating_count: 1700000 },
        { id: 9, title: 'Avengers: Endgame', description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions.', release_date: '2019-04-26', runtime: 181, poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', average_rating: 8.4, rating_count: 2800000 },
        { id: 10, title: 'Spider-Man: No Way Home', description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.', release_date: '2021-12-17', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', average_rating: 8.2, rating_count: 1500000 },
        { id: 11, title: 'Top Gun: Maverick', description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', release_date: '2022-05-27', runtime: 130, poster_url: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', average_rating: 8.3, rating_count: 1200000 },
        { id: 12, title: 'Dune', description: 'Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.', release_date: '2021-10-22', runtime: 155, poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', average_rating: 8.0, rating_count: 1100000 },
        { id: 13, title: 'Titanic', description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist.', release_date: '1997-12-19', runtime: 194, poster_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', average_rating: 7.9, rating_count: 1000000 },
        { id: 14, title: 'Avatar', description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission.', release_date: '2009-12-18', runtime: 162, poster_url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', average_rating: 7.8, rating_count: 1300000 },
        { id: 15, title: 'The Lion King', description: 'Lion prince Simba and his father are targeted by his bitter uncle.', release_date: '1994-06-24', runtime: 88, poster_url: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', average_rating: 8.5, rating_count: 900000 },
        { id: 16, title: 'Jurassic Park', description: 'A pragmatic paleontologist visiting an almost complete theme park.', release_date: '1993-06-11', runtime: 127, poster_url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', average_rating: 8.1, rating_count: 850000 }
      ];
      
      let movies = [];
      
      // Return different movies based on timeframe
      switch (timeframe) {
        case 'today':
          // Today's trending - newer releases with high engagement
          movies = [
            allMovies[8], // Avengers: Endgame
            allMovies[9], // Spider-Man: No Way Home
            allMovies[10], // Top Gun: Maverick
            allMovies[11], // Dune
            allMovies[5], // Inception
            allMovies[2], // The Dark Knight
            allMovies[7], // Interstellar
            allMovies[6]  // The Matrix
          ];
          break;
          
        case 'week':
          // This week's popular - mix of new and classic
          movies = [
            allMovies[10], // Top Gun: Maverick
            allMovies[2],  // The Dark Knight
            allMovies[9],  // Spider-Man: No Way Home
            allMovies[5],  // Inception
            allMovies[0],  // The Shawshank Redemption
            allMovies[11], // Dune
            allMovies[3],  // Pulp Fiction
            allMovies[8]   // Avengers: Endgame
          ];
          break;
          
        case 'month':
          // This month's popular - balanced mix
          movies = [
            allMovies[11], // Dune
            allMovies[0],  // The Shawshank Redemption
            allMovies[10], // Top Gun: Maverick
            allMovies[1],  // The Godfather
            allMovies[5],  // Inception
            allMovies[2],  // The Dark Knight
            allMovies[4],  // Forrest Gump
            allMovies[9]   // Spider-Man: No Way Home
          ];
          break;
          
        default: // 'all'
          // All time popular - highest rated classics
          movies = [
            allMovies[0], // The Shawshank Redemption
            allMovies[1], // The Godfather
            allMovies[2], // The Dark Knight
            allMovies[3], // Pulp Fiction
            allMovies[4], // Forrest Gump
            allMovies[5], // Inception
            allMovies[6], // The Matrix
            allMovies[7]  // Interstellar
          ];
      }
      
      // Limit results
      const limitedMovies = movies.slice(0, parseInt(limit));
      console.log(`✅ Returning ${limitedMovies.length} movies for timeframe: ${timeframe}`);
      
      res.json(limitedMovies);
    } catch (error) {
      console.error('Get popular error:', error);
      res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
  }

  static async getByGenre(req, res) {
    try {
      const { genre } = req.params;
      const { limit = 20 } = req.query;
      
      try {
        const movies = await Movie.findByGenre(genre, parseInt(limit));
        if (movies && movies.length > 0) {
          return res.json(movies);
        }
      } catch (dbError) {
        console.log('Database error, returning sample data:', dbError.message);
      }
      
      // Sample data by genre
      const genreMovies = {
        'Action': [
          { id: 3, title: 'The Dark Knight', description: 'Batman raises the stakes in his war on crime.', release_date: '2008-07-18', runtime: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 9.0, rating_count: 2600000 },
          { id: 8, title: 'The Matrix', description: 'A computer hacker learns about reality.', release_date: '1999-03-31', runtime: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', average_rating: 8.7, rating_count: 1800000 },
          { id: 5, title: 'Inception', description: 'A thief who steals corporate secrets.', release_date: '2010-07-16', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 8.8, rating_count: 2300000 },
        ],
        'Drama': [
          { id: 1, title: 'The Shawshank Redemption', description: 'Two imprisoned men bond.', release_date: '1994-09-23', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', average_rating: 9.3, rating_count: 2500000 },
          { id: 2, title: 'The Godfather', description: 'The aging patriarch of crime dynasty.', release_date: '1972-03-24', runtime: 175, poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', average_rating: 9.2, rating_count: 1800000 },
          { id: 7, title: 'Forrest Gump', description: 'A man with low IQ accomplishes great things.', release_date: '1994-07-06', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', average_rating: 8.8, rating_count: 1900000 },
        ],
        'Comedy': [
          { id: 201, title: '3 Idiots', description: 'A Delhi girl from a traditional family sets out on a solo honeymoon.', release_date: '2013-09-06', runtime: 146, poster_url: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8IC0.jpg', average_rating: 8.4, rating_count: 1200000 },
          { id: 202, title: 'Zindagi Na Milegi Dobara', description: 'Three unemployed men find the solution to all their money problems.', release_date: '2000-03-31', runtime: 156, poster_url: 'https://image.tmdb.org/t/p/w500/8LqXqNDiAdPKKmBXOG6B87dCqCN.jpg', average_rating: 8.1, rating_count: 900000 },
          { id: 203, title: 'The Hangover', description: 'Three buddies wake up from a bachelor party in Las Vegas.', release_date: '2009-06-05', runtime: 100, poster_url: 'https://image.tmdb.org/t/p/w500/wwjcD1C8XEKTLmh9nvmRLCnUMC9.jpg', average_rating: 7.7, rating_count: 800000 },
          { id: 204, title: 'Superbad', description: 'Two co-dependent high school seniors are forced to deal with separation anxiety.', release_date: '2007-08-17', runtime: 113, poster_url: 'https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg', average_rating: 7.6, rating_count: 700000 },
          { id: 205, title: 'Step Brothers', description: 'Two aimless middle-aged losers still living at home are forced to become roommates.', release_date: '2008-07-25', runtime: 98, poster_url: 'https://image.tmdb.org/t/p/w500/wRR62xfv7pEP5MeZGHvyr7kcFCq.jpg', average_rating: 6.9, rating_count: 600000 },
        ],
        'Thriller': [
          { id: 301, title: 'Se7en', description: 'Two detectives hunt a serial killer.', release_date: '1995-09-22', runtime: 127, poster_url: 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg', average_rating: 8.6, rating_count: 1500000 },
          { id: 302, title: 'The Silence of the Lambs', description: 'FBI cadet seeks help from cannibal killer.', release_date: '1991-02-14', runtime: 118, poster_url: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', average_rating: 8.6, rating_count: 1300000 },
          { id: 303, title: 'The Usual Suspects', description: 'A sole survivor tells of twisty events.', release_date: '1995-08-16', runtime: 106, poster_url: 'https://image.tmdb.org/t/p/w500/9Xw0I5RV2ZqNLpul6lMcsJVfoCd.jpg', average_rating: 8.5, rating_count: 1200000 },
          { id: 304, title: 'Memento', description: 'Man with short-term memory loss tracks murderer.', release_date: '2000-10-11', runtime: 113, poster_url: 'https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg', average_rating: 8.4, rating_count: 1200000 },
        ],
        'Sci-Fi': [
          { id: 401, title: 'Interstellar', description: 'Explorers travel through a wormhole.', release_date: '2014-11-07', runtime: 169, poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', average_rating: 8.6, rating_count: 1700000 },
          { id: 402, title: 'Blade Runner 2049', description: 'A young blade runner discovers a secret.', release_date: '2017-10-06', runtime: 164, poster_url: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', average_rating: 8.0, rating_count: 600000 },
          { id: 403, title: 'Arrival', description: 'Linguist works with military to communicate with aliens.', release_date: '2016-11-11', runtime: 116, poster_url: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', average_rating: 7.9, rating_count: 700000 },
          { id: 404, title: 'Ex Machina', description: 'Programmer evaluates humanoid AI.', release_date: '2015-04-24', runtime: 108, poster_url: 'https://image.tmdb.org/t/p/w500/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg', average_rating: 7.7, rating_count: 550000 },
        ],
        'Horror': [
          { id: 501, title: 'The Conjuring', description: 'Paranormal investigators help a family.', release_date: '2013-07-19', runtime: 112, poster_url: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg', average_rating: 7.5, rating_count: 900000 },
          { id: 502, title: 'The Shining', description: 'Family heads to isolated hotel for winter.', release_date: '1980-05-23', runtime: 146, poster_url: 'https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg', average_rating: 8.4, rating_count: 950000 },
          { id: 503, title: 'Get Out', description: 'Young man uncovers disturbing secret.', release_date: '2017-02-24', runtime: 104, poster_url: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', average_rating: 7.7, rating_count: 600000 },
          { id: 504, title: 'A Quiet Place', description: 'Family must live in silence to survive.', release_date: '2018-04-06', runtime: 90, poster_url: 'https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg', average_rating: 7.5, rating_count: 550000 },
        ],
        'Romance': [
          { id: 601, title: 'Titanic', description: 'Love story aboard ill-fated ship.', release_date: '1997-12-19', runtime: 194, poster_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', average_rating: 7.9, rating_count: 2100000 },
          { id: 602, title: 'The Notebook', description: 'Poor yet passionate young man falls in love.', release_date: '2004-06-25', runtime: 123, poster_url: 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg', average_rating: 7.8, rating_count: 550000 },
          { id: 603, title: 'La La Land', description: 'Jazz musician and aspiring actress fall in love.', release_date: '2016-12-09', runtime: 128, poster_url: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', average_rating: 8.0, rating_count: 600000 },
        ],
        'Adventure': [
          { id: 701, title: 'Indiana Jones', description: 'Archaeologist seeks the Ark.', release_date: '1981-06-12', runtime: 115, poster_url: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg', average_rating: 8.0, rating_count: 850000 },
          { id: 702, title: 'Jurassic Park', description: 'Theme park with cloned dinosaurs.', release_date: '1993-06-11', runtime: 127, poster_url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', average_rating: 8.1, rating_count: 1500000 },
          { id: 703, title: 'The Lord of the Rings: The Return of the King', description: 'Final battle for Middle-earth.', release_date: '2003-12-17', runtime: 201, poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', average_rating: 9.0, rating_count: 1800000 },
          { id: 704, title: 'Pirates of the Caribbean', description: 'Blacksmith teams with pirate to rescue governor\'s daughter.', release_date: '2003-07-09', runtime: 143, poster_url: 'https://image.tmdb.org/t/p/w500/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg', average_rating: 8.0, rating_count: 1100000 },
        ]
      };
      
      const movies = genreMovies[genre] || [];
      res.json(movies);
    } catch (error) {
      console.error('Get by genre error:', error);
      res.status(500).json({ error: 'Failed to fetch movies by genre' });
    }
  }

  static async getTVShows(req, res) {
    try {
      const { limit = 20 } = req.query;
      const db = require('../config/database');
      
      const result = await db.query(
        `SELECT * FROM movies 
         WHERE type = 'tv' 
         ORDER BY release_date DESC 
         LIMIT $1`,
        [parseInt(limit)]
      );
      
      return res.json(result.rows);

    } catch (error) {
      console.error('Get TV shows error:', error);
      res.status(500).json({ error: 'Failed to fetch TV shows' });
    }
  }
}

module.exports = MovieController;
