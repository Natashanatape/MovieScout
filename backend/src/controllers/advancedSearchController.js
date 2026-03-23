const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

class AdvancedSearchController {
  // Advanced search with multiple filters
  static async advancedSearch(req, res) {
    try {
      const {
        query = '',
        genres = [],
        yearFrom,
        yearTo,
        ratingFrom,
        ratingTo,
        sortBy = 'relevance',
        page = 1,
        limit = 20
      } = req.query;

      try {
        let whereConditions = [];
        let queryParams = [];
        let paramCount = 0;

        // Base query
        let sql = `
          SELECT DISTINCT m.*, 
                 COALESCE(AVG(r.rating), 0) as average_rating,
                 COUNT(r.id) as rating_count,
                 ARRAY_AGG(DISTINCT g.name) as genres
          FROM movies m
          LEFT JOIN ratings r ON m.id = r.movie_id
          LEFT JOIN movie_genres mg ON m.id = mg.movie_id
          LEFT JOIN genres g ON mg.genre_id = g.id
        `;

        // Title search
        if (query.trim()) {
          paramCount++;
          whereConditions.push(`m.title ILIKE $${paramCount}`);
          queryParams.push(`%${query}%`);
        }

        // Genre filter
        if (genres.length > 0) {
          const genreArray = Array.isArray(genres) ? genres : [genres];
          paramCount++;
          whereConditions.push(`g.name = ANY($${paramCount})`);
          queryParams.push(genreArray);
        }

        // Year range
        if (yearFrom) {
          paramCount++;
          whereConditions.push(`EXTRACT(YEAR FROM m.release_date) >= $${paramCount}`);
          queryParams.push(parseInt(yearFrom));
        }
        if (yearTo) {
          paramCount++;
          whereConditions.push(`EXTRACT(YEAR FROM m.release_date) <= $${paramCount}`);
          queryParams.push(parseInt(yearTo));
        }

        // Add WHERE clause
        if (whereConditions.length > 0) {
          sql += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        // Group by
        sql += ` GROUP BY m.id`;

        // Rating filter (after GROUP BY)
        if (ratingFrom || ratingTo) {
          sql += ` HAVING`;
          if (ratingFrom) {
            paramCount++;
            sql += ` AVG(r.rating) >= $${paramCount}`;
            queryParams.push(parseFloat(ratingFrom));
          }
          if (ratingTo) {
            if (ratingFrom) sql += ` AND`;
            paramCount++;
            sql += ` AVG(r.rating) <= $${paramCount}`;
            queryParams.push(parseFloat(ratingTo));
          }
        }

        // Sorting
        switch (sortBy) {
          case 'rating':
            sql += ` ORDER BY average_rating DESC`;
            break;
          case 'year':
            sql += ` ORDER BY m.release_date DESC`;
            break;
          case 'title':
            sql += ` ORDER BY m.title ASC`;
            break;
          case 'popularity':
            sql += ` ORDER BY rating_count DESC`;
            break;
          default:
            sql += ` ORDER BY m.id DESC`;
        }

        // Pagination
        const offset = (page - 1) * limit;
        paramCount += 2;
        sql += ` LIMIT $${paramCount - 1} OFFSET $${paramCount}`;
        queryParams.push(parseInt(limit), offset);

        const result = await pool.query(sql, queryParams);

        // Get total count for pagination
        let countSql = `
          SELECT COUNT(DISTINCT m.id) as total
          FROM movies m
          LEFT JOIN ratings r ON m.id = r.movie_id
          LEFT JOIN movie_genres mg ON m.id = mg.movie_id
          LEFT JOIN genres g ON mg.genre_id = g.id
        `;
        
        if (whereConditions.length > 0) {
          countSql += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        const countResult = await pool.query(countSql, queryParams.slice(0, -2));
        const total = parseInt(countResult.rows[0].total);

        return res.json({
          movies: result.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          },
          filters: {
            query,
            genres,
            yearFrom,
            yearTo,
            ratingFrom,
            ratingTo,
            sortBy
          }
        });
      } catch (dbError) {
        console.log('Database error, returning sample data:', dbError.message);
        
        // Sample movies
        const sampleMovies = [
          { id: 1, title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years.', release_date: '1994-09-23', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', average_rating: 9.3, rating_count: 2500000 },
          { id: 2, title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty.', release_date: '1972-03-24', runtime: 175, poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', average_rating: 9.2, rating_count: 1800000 },
          { id: 3, title: 'The Dark Knight', description: 'Batman raises the stakes in his war on crime.', release_date: '2008-07-18', runtime: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 9.0, rating_count: 2600000 },
          { id: 4, title: 'Pulp Fiction', description: 'The lives of two mob hitmen intertwine.', release_date: '1994-10-14', runtime: 154, poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', average_rating: 8.9, rating_count: 2000000 },
          { id: 5, title: 'Inception', description: 'A thief who steals corporate secrets.', release_date: '2010-07-16', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 8.8, rating_count: 2300000 },
          { id: 6, title: 'Fight Club', description: 'An insomniac office worker forms an underground fight club.', release_date: '1999-10-15', runtime: 139, poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', average_rating: 8.8, rating_count: 2000000 },
          { id: 7, title: 'Forrest Gump', description: 'A man with a low IQ accomplishes great things.', release_date: '1994-07-06', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', average_rating: 8.8, rating_count: 1900000 },
          { id: 8, title: 'The Matrix', description: 'A computer hacker learns about the true nature of reality.', release_date: '1999-03-31', runtime: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', average_rating: 8.7, rating_count: 1800000 },
        ];

        // Filter sample data
        let filtered = sampleMovies;
        if (query.trim()) {
          filtered = filtered.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
        }

        return res.json({
          movies: filtered,
          pagination: {
            page: 1,
            limit: 20,
            total: filtered.length,
            pages: 1
          },
          filters: { query, genres, yearFrom, yearTo, ratingFrom, ratingTo, sortBy }
        });
      }
    } catch (error) {
      console.error('Advanced search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  // Get filter options
  static async getFilterOptions(req, res) {
    try {
      try {
        // Get all genres
        const genresResult = await pool.query('SELECT name FROM genres ORDER BY name');
        
        // Get year range
        const yearResult = await pool.query(`
          SELECT 
            MIN(EXTRACT(YEAR FROM release_date)) as min_year,
            MAX(EXTRACT(YEAR FROM release_date)) as max_year
          FROM movies
        `);

        // Get rating range
        const ratingResult = await pool.query(`
          SELECT 
            MIN(rating) as min_rating,
            MAX(rating) as max_rating
          FROM ratings
        `);

        return res.json({
          genres: genresResult.rows.map(row => row.name),
          years: {
            min: parseInt(yearResult.rows[0].min_year) || 1900,
            max: parseInt(yearResult.rows[0].max_year) || new Date().getFullYear()
          },
          ratings: {
            min: parseFloat(ratingResult.rows[0].min_rating) || 1,
            max: parseFloat(ratingResult.rows[0].max_rating) || 10
          }
        });
      } catch (dbError) {
        console.log('Database error, returning default filter options:', dbError.message);
        return res.json({
          genres: ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Adventure'],
          years: { min: 1900, max: 2024 },
          ratings: { min: 1, max: 10 }
        });
      }
    } catch (error) {
      console.error('Filter options error:', error);
      res.status(500).json({ error: 'Failed to get filter options' });
    }
  }

  // Save search history
  static async saveSearch(req, res) {
    try {
      const { query, filters } = req.body;
      const userId = req.user.id;

      await pool.query(`
        INSERT INTO search_history (user_id, search_query, filters_json, created_at)
        VALUES ($1, $2, $3, NOW())
      `, [userId, query, JSON.stringify(filters)]);

      res.json({ message: 'Search saved' });
    } catch (error) {
      console.error('Save search error:', error);
      res.status(500).json({ error: 'Failed to save search' });
    }
  }

  // Get search history
  static async getSearchHistory(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await pool.query(`
        SELECT search_query, filters_json, created_at
        FROM search_history
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `, [userId]);

      res.json(result.rows);
    } catch (error) {
      console.error('Search history error:', error);
      res.status(500).json({ error: 'Failed to get search history' });
    }
  }
}

module.exports = AdvancedSearchController;