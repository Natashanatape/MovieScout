require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupReleaseInfo() {
  try {
    console.log('🌍 Setting up Release Information...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS release_dates (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        country VARCHAR(100),
        release_date DATE,
        release_type VARCHAR(50),
        certification VARCHAR(20),
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_release_dates_movie ON release_dates(movie_id);`);

    console.log('✅ Tables created');

    const movies = await pool.query(`SELECT id, title, release_date FROM movies WHERE type = 'movie' LIMIT 10`);
    
    if (movies.rows.length === 0) {
      console.log('❌ No movies found');
      return;
    }

    await pool.query('DELETE FROM release_dates');

    const countries = [
      { name: 'USA', cert: 'PG-13' },
      { name: 'UK', cert: '12A' },
      { name: 'India', cert: 'U/A' },
      { name: 'Canada', cert: 'PG' },
      { name: 'Australia', cert: 'M' }
    ];

    for (const movie of movies.rows) {
      for (const country of countries) {
        const releaseDate = new Date(movie.release_date);
        releaseDate.setDate(releaseDate.getDate() + Math.floor(Math.random() * 30));

        await pool.query(`
          INSERT INTO release_dates (movie_id, country, release_date, release_type, certification)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          movie.id,
          country.name,
          releaseDate.toISOString().split('T')[0],
          'Theatrical',
          country.cert
        ]);
      }

      console.log(`✅ Added release info for: ${movie.title}`);
    }

    console.log('\n✅ Release Information setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupReleaseInfo();
