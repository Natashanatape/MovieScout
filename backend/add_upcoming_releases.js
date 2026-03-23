require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addUpcomingReleases() {
  try {
    console.log('🎬 Adding upcoming movie releases...');

    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS upcoming_releases (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER,
        release_date DATE NOT NULL,
        release_type VARCHAR(50) DEFAULT 'theatrical',
        anticipation_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get ONLY movies (not TV shows)
    const moviesResult = await pool.query(`
      SELECT id, title FROM movies 
      WHERE type = 'movie' OR type IS NULL
      ORDER BY id 
      LIMIT 30
    `);
    
    const movieIds = moviesResult.rows;

    if (movieIds.length === 0) {
      console.log('❌ No movies found in database');
      return;
    }

    console.log(`Found ${movieIds.length} movies`);

    // Clear existing data
    await pool.query('DELETE FROM upcoming_releases');

    // Add upcoming releases with different dates
    const today = new Date();
    const releases = [];

    movieIds.forEach((movie, index) => {
      let daysToAdd;
      
      // Distribute movies across different time periods
      if (index < 5) {
        // This month (1-30 days)
        daysToAdd = (index + 1) * 6;
      } else if (index < 15) {
        // Next 3 months (31-90 days)
        daysToAdd = 30 + ((index - 5) * 6);
      } else if (index < 25) {
        // Next 6 months (91-180 days)
        daysToAdd = 90 + ((index - 15) * 9);
      } else {
        // Rest of year (181-365 days)
        daysToAdd = 180 + ((index - 25) * 15);
      }
      
      const releaseDate = new Date(today);
      releaseDate.setDate(releaseDate.getDate() + daysToAdd);
      
      releases.push({
        movieId: movie.id,
        movieTitle: movie.title,
        releaseDate: releaseDate.toISOString().split('T')[0],
        releaseType: index % 3 === 0 ? 'theatrical' : index % 3 === 1 ? 'streaming' : 'limited',
        anticipationScore: Math.floor(Math.random() * 100)
      });
    });

    // Insert releases
    for (const release of releases) {
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, $3, $4)
      `, [release.movieId, release.releaseDate, release.releaseType, release.anticipationScore]);
      console.log(`✅ Added: ${release.movieTitle} - ${release.releaseDate}`);
    }

    console.log(`\n✅ Added ${releases.length} upcoming movie releases`);
    console.log('📅 Release dates range from', releases[0].releaseDate, 'to', releases[releases.length - 1].releaseDate);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addUpcomingReleases();
