const Movie = require('../models/Movie');
const redisClient = require('../config/redis');

class MovieController {
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 20, sortBy = 'created_at', order = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      // Try database first, fallback to sample data
      try {
        const cacheKey = `movies:page:${page}:limit:${limit}:sort:${sortBy}:${order}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
          return res.json(JSON.parse(cached));
        }

        const movies = await Movie.findAll({ limit: parseInt(limit), offset, sortBy, order });
        
        if (movies && movies.length > 0) {
          await redisClient.setEx(cacheKey, 300, JSON.stringify(movies));
          return res.json(movies);
        }
        
        // If no movies in database, return sample data
        throw new Error('No movies found');
      } catch (dbError) {
        console.log('Database error, returning sample data:', dbError.message);
        
        // Sample movies data with real TMDB images
        const sampleMovies = [
          {
            id: 1,
            title: 'The Shawshank Redemption',
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            release_date: '1994-09-23',
            runtime: 142,
            poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            average_rating: 9.3,
            rating_count: 2500000
          },
          {
            id: 2,
            title: 'The Godfather',
            description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            release_date: '1972-03-24',
            runtime: 175,
            poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
            average_rating: 9.2,
            rating_count: 1800000
          },
          {
            id: 3,
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
            release_date: '2008-07-18',
            runtime: 152,
            poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            average_rating: 9.0,
            rating_count: 2600000
          },
          {
            id: 4,
            title: 'Pulp Fiction',
            description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
            release_date: '1994-10-14',
            runtime: 154,
            poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            average_rating: 8.9,
            rating_count: 2000000
          },
          {
            id: 5,
            title: 'Forrest Gump',
            description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
            release_date: '1994-07-06',
            runtime: 142,
            poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
            average_rating: 8.8,
            rating_count: 2100000
          },
          {
            id: 6,
            title: 'Inception',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
            release_date: '2010-07-16',
            runtime: 148,
            poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            average_rating: 8.8,
            rating_count: 2300000
          },
          {
            id: 7,
            title: 'The Matrix',
            description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
            release_date: '1999-03-31',
            runtime: 136,
            poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            average_rating: 8.7,
            rating_count: 1900000
          },
          {
            id: 8,
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            release_date: '2014-11-07',
            runtime: 169,
            poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            average_rating: 8.6,
            rating_count: 1700000
          }
        ];
        
        return res.json(sampleMovies);
      }
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
        
        // Sample movie data
        const sampleMovies = {
          1: {
            id: 1,
            title: 'The Shawshank Redemption',
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            release_date: '1994-09-23',
            runtime: 142,
            poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            average_rating: 9.3,
            rating_count: 2500000,
            cast: [
              { id: 1, name: 'Tim Robbins', character: 'Andy Dufresne' },
              { id: 2, name: 'Morgan Freeman', character: 'Ellis Boyd Redding' }
            ],
            reviews: []
          },
          2: {
            id: 2,
            title: 'The Godfather',
            description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            release_date: '1972-03-24',
            runtime: 175,
            poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
            average_rating: 9.2,
            rating_count: 1800000,
            cast: [
              { id: 3, name: 'Marlon Brando', character: 'Don Vito Corleone' },
              { id: 4, name: 'Al Pacino', character: 'Michael Corleone' }
            ],
            reviews: []
          },
          3: {
            id: 3,
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
            release_date: '2008-07-18',
            runtime: 152,
            poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            average_rating: 9.0,
            rating_count: 2600000,
            cast: [
              { id: 5, name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
              { id: 6, name: 'Heath Ledger', character: 'Joker' }
            ],
            reviews: []
          },
          4: {
            id: 4,
            title: 'Pulp Fiction',
            description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
            release_date: '1994-10-14',
            runtime: 154,
            poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            average_rating: 8.9,
            rating_count: 2000000,
            cast: [
              { id: 7, name: 'John Travolta', character: 'Vincent Vega' },
              { id: 8, name: 'Samuel L. Jackson', character: 'Jules Winnfield' }
            ],
            reviews: []
          },
          5: {
            id: 5,
            title: 'Forrest Gump',
            description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
            release_date: '1994-07-06',
            runtime: 142,
            poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
            average_rating: 8.8,
            rating_count: 2100000,
            cast: [
              { id: 9, name: 'Tom Hanks', character: 'Forrest Gump' },
              { id: 10, name: 'Robin Wright', character: 'Jenny Curran' }
            ],
            reviews: []
          },
          6: {
            id: 6,
            title: 'Inception',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
            release_date: '2010-07-16',
            runtime: 148,
            poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            average_rating: 8.8,
            rating_count: 2300000,
            cast: [
              { id: 11, name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
              { id: 12, name: 'Joseph Gordon-Levitt', character: 'Arthur' }
            ],
            reviews: []
          },
          7: {
            id: 7,
            title: 'The Matrix',
            description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
            release_date: '1999-03-31',
            runtime: 136,
            poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            average_rating: 8.7,
            rating_count: 1900000,
            cast: [
              { id: 13, name: 'Keanu Reeves', character: 'Neo' },
              { id: 14, name: 'Laurence Fishburne', character: 'Morpheus' }
            ],
            reviews: []
          },
          8: {
            id: 8,
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            release_date: '2014-11-07',
            runtime: 169,
            poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            average_rating: 8.6,
            rating_count: 1700000,
            cast: [
              { id: 15, name: 'Matthew McConaughey', character: 'Cooper' },
              { id: 16, name: 'Anne Hathaway', character: 'Brand' }
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
          {
            id: 1,
            title: 'The Shawshank Redemption',
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            release_date: '1994-09-23',
            runtime: 142,
            poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            average_rating: 9.3,
            rating_count: 2500000
          },
          {
            id: 2,
            title: 'The Godfather',
            description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            release_date: '1972-03-24',
            runtime: 175,
            poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
            average_rating: 9.2,
            rating_count: 1800000
          },
          {
            id: 3,
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
            release_date: '2008-07-18',
            runtime: 152,
            poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            average_rating: 9.0,
            rating_count: 2600000
          },
          {
            id: 4,
            title: 'Pulp Fiction',
            description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
            release_date: '1994-10-14',
            runtime: 154,
            poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            average_rating: 8.9,
            rating_count: 2000000
          },
          {
            id: 5,
            title: 'Forrest Gump',
            description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
            release_date: '1994-07-06',
            runtime: 142,
            poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
            average_rating: 8.8,
            rating_count: 2100000
          },
          {
            id: 6,
            title: 'Inception',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
            release_date: '2010-07-16',
            runtime: 148,
            poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            average_rating: 8.8,
            rating_count: 2300000
          },
          {
            id: 7,
            title: 'The Matrix',
            description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
            release_date: '1999-03-31',
            runtime: 136,
            poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            average_rating: 8.7,
            rating_count: 1900000
          },
          {
            id: 8,
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            release_date: '2014-11-07',
            runtime: 169,
            poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            average_rating: 8.6,
            rating_count: 1700000
          }
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
      const movies = await Movie.findAll({ 
        limit: parseInt(limit), 
        sortBy: 'rating_count', 
        order: 'DESC' 
      });
      res.json(movies);
    } catch (error) {
      console.error('Get trending error:', error);
      res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
  }

  static async getPopular(req, res) {
    try {
      const { limit = 10, timeframe = 'all' } = req.query;
      console.log('🔥 Popular API called with timeframe:', timeframe);
      
      // Sample movies data with different sets for each timeframe
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
        { id: 12, title: 'Dune', description: 'Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.', release_date: '2021-10-22', runtime: 155, poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', average_rating: 8.0, rating_count: 1100000 }
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
          { id: 9, title: 'The Hangover', description: 'Three friends lose their buddy in Vegas.', release_date: '2009-06-05', runtime: 100, poster_url: 'https://image.tmdb.org/t/p/w500/uluhlXhjRbRs5cL7J3GSe1vTAH0.jpg', average_rating: 7.3, rating_count: 1200000 },
        ],
        'Thriller': [
          { id: 3, title: 'The Dark Knight', description: 'Batman vs Joker.', release_date: '2008-07-18', runtime: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 9.0, rating_count: 2600000 },
          { id: 4, title: 'Pulp Fiction', description: 'Mob hitmen stories intertwine.', release_date: '1994-10-14', runtime: 154, poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', average_rating: 8.9, rating_count: 2000000 },
        ],
        'Sci-Fi': [
          { id: 8, title: 'The Matrix', description: 'Reality is not what it seems.', release_date: '1999-03-31', runtime: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', average_rating: 8.7, rating_count: 1800000 },
          { id: 5, title: 'Inception', description: 'Dream within a dream.', release_date: '2010-07-16', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 8.8, rating_count: 2300000 },
        ],
        'Horror': [
          { id: 10, title: 'The Conjuring', description: 'Paranormal investigators help a family.', release_date: '2013-07-19', runtime: 112, poster_url: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg', average_rating: 7.5, rating_count: 900000 },
        ],
        'Romance': [
          { id: 7, title: 'Forrest Gump', description: 'Love story across decades.', release_date: '1994-07-06', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', average_rating: 8.8, rating_count: 1900000 },
        ],
        'Adventure': [
          { id: 11, title: 'Indiana Jones', description: 'Archaeologist seeks the Ark.', release_date: '1981-06-12', runtime: 115, poster_url: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg', average_rating: 8.0, rating_count: 850000 },
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
      
      try {
        const result = await db.query(
          `SELECT * FROM movies 
           WHERE type = 'tv_show' 
           ORDER BY release_date DESC 
           LIMIT $1`,
          [parseInt(limit)]
        );
        
        if (result.rows && result.rows.length > 0) {
          return res.json(result.rows);
        }
      } catch (dbError) {
        console.log('Database error, returning sample TV shows:', dbError.message);
      }
      
      // Sample TV shows data
      const tvShows = [
        { id: 101, title: 'Breaking Bad', description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.', release_date: '2008-01-20', runtime: 47, poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', type: 'tv_show', seasons: 5, episodes: 62, average_rating: 9.5 },
        { id: 102, title: 'Game of Thrones', description: 'Nine noble families fight for control over the lands of Westeros.', release_date: '2011-04-17', runtime: 57, poster_url: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', type: 'tv_show', seasons: 8, episodes: 73, average_rating: 9.2 },
        { id: 103, title: 'Stranger Things', description: 'When a young boy disappears, his mother and friends must confront terrifying supernatural forces.', release_date: '2016-07-15', runtime: 51, poster_url: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', type: 'tv_show', seasons: 4, episodes: 42, average_rating: 8.7 },
        { id: 104, title: 'The Crown', description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.', release_date: '2016-11-04', runtime: 58, poster_url: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg', type: 'tv_show', seasons: 6, episodes: 60, average_rating: 8.6 },
        { id: 105, title: 'The Mandalorian', description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.', release_date: '2019-11-12', runtime: 40, poster_url: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg', type: 'tv_show', seasons: 3, episodes: 24, average_rating: 8.7 },
        { id: 106, title: 'The Office', description: 'A mockumentary on a group of typical office workers.', release_date: '2005-03-24', runtime: 22, poster_url: 'https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg', type: 'tv_show', seasons: 9, episodes: 201, average_rating: 9.0 },
        { id: 107, title: 'Friends', description: 'Follows the personal and professional lives of six friends living in Manhattan.', release_date: '1994-09-22', runtime: 22, poster_url: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg', type: 'tv_show', seasons: 10, episodes: 236, average_rating: 8.9 },
        { id: 108, title: 'The Witcher', description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world.', release_date: '2019-12-20', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', type: 'tv_show', seasons: 3, episodes: 24, average_rating: 8.2 },
        { id: 109, title: 'Peaky Blinders', description: 'A gangster family epic set in 1900s England.', release_date: '2013-09-12', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', type: 'tv_show', seasons: 6, episodes: 36, average_rating: 8.8 },
        { id: 110, title: 'Money Heist', description: 'An unusual group of robbers attempt to carry out the most perfect robbery.', release_date: '2017-05-02', runtime: 70, poster_url: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', type: 'tv_show', seasons: 5, episodes: 41, average_rating: 8.3 },
        { id: 111, title: 'Sherlock', description: 'A modern update finds the famous sleuth solving crime in 21st century London.', release_date: '2010-07-25', runtime: 88, poster_url: 'https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg', type: 'tv_show', seasons: 4, episodes: 13, average_rating: 9.1 },
        { id: 112, title: 'The Boys', description: 'A group of vigilantes set out to take down corrupt superheroes.', release_date: '2019-07-26', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg', type: 'tv_show', seasons: 4, episodes: 32, average_rating: 8.7 },
        { id: 113, title: 'Wednesday', description: 'Follows Wednesday Addams\' years as a student at Nevermore Academy.', release_date: '2022-11-23', runtime: 50, poster_url: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', type: 'tv_show', seasons: 1, episodes: 8, average_rating: 8.1 },
        { id: 114, title: 'The Last of Us', description: 'Joel and Ellie embark on a brutal journey across post-pandemic America.', release_date: '2023-01-15', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', type: 'tv_show', seasons: 1, episodes: 9, average_rating: 8.8 },
        { id: 115, title: 'House of the Dragon', description: 'An internal succession war within House Targaryen.', release_date: '2022-08-21', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg', type: 'tv_show', seasons: 2, episodes: 18, average_rating: 8.4 }
      ];
      
      res.json(tvShows.slice(0, parseInt(limit)));
    } catch (error) {
      console.error('Get TV shows error:', error);
      res.status(500).json({ error: 'Failed to fetch TV shows' });
    }
  }
}

module.exports = MovieController;
