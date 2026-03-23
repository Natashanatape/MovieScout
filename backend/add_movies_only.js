const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addMoviesOnly() {
  try {
    console.log('🎬 Adding movies only...\n');

    const moviesResult = await pool.query(`
      SELECT id FROM movies 
      WHERE type = 'movie' OR type IS NULL
      ORDER BY id 
      LIMIT 20
    `);
    
    const movieIds = moviesResult.rows.map(r => r.id);

    if (movieIds.length === 0) {
      console.log('❌ No movies found');
      process.exit(1);
    }

    console.log(`✅ Found ${movieIds.length} movies\n`);

    const today = new Date();
    
    // This Month
    for (let i = 0; i < 3 && i < movieIds.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + (i + 1) * 5);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added This Month releases');

    // Next 3 Months
    for (let i = 3; i < 8 && i < movieIds.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 45 + (i - 3) * 10);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added Next 3 Months releases');

    // Next 6 Months
    for (let i = 8; i < 13 && i < movieIds.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 120 + (i - 8) * 12);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added Next 6 Months releases');

    // This Year
    for (let i = 13; i < 18 && i < movieIds.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 240 + (i - 13) * 20);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added This Year releases\n');

    // Box Office
    console.log('💰 Adding Box Office data...');
    for (let i = 0; i < 10 && i < movieIds.length; i++) {
      await pool.query(`
        INSERT INTO box_office (
          movie_id, weekend_rank, weekend_gross, total_gross, 
          domestic_gross, international_gross, budget, theater_count, 
          week_number, date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        movieIds[i], i + 1,
        50000000 + Math.floor(Math.random() * 100000000),
        200000000 + Math.floor(Math.random() * 500000000),
        150000000 + Math.floor(Math.random() * 300000000),
        100000000 + Math.floor(Math.random() * 400000000),
        100000000 + Math.floor(Math.random() * 200000000),
        3000 + Math.floor(Math.random() * 2000), 1, new Date()
      ]);
    }
    console.log('✅ Added Box Office data\n');

    const upcomingCount = await pool.query('SELECT COUNT(*) FROM upcoming_releases');
    const boxOfficeCount = await pool.query('SELECT COUNT(*) FROM box_office');

    console.log('📊 Final Counts:');
    console.log(`  Coming Soon: ${upcomingCount.rows[0].count} movies`);
    console.log(`  Box Office: ${boxOfficeCount.rows[0].count} movies\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addMoviesOnly();
