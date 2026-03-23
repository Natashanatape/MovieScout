const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addMoreReleases() {
  try {
    console.log('🎬 Adding more upcoming releases...\n');

    const moviesResult = await pool.query('SELECT id FROM movies ORDER BY id LIMIT 20');
    const movieIds = moviesResult.rows.map(r => r.id);

    if (movieIds.length === 0) {
      console.log('❌ No movies found');
      process.exit(1);
    }

    const today = new Date();
    
    // This Month (15 days)
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + (i + 1) * 5);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added This Month releases');

    // Next 3 Months (45-90 days)
    for (let i = 3; i < 8; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 45 + (i - 3) * 10);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added Next 3 Months releases');

    // Next 6 Months (120-180 days)
    for (let i = 8; i < 13; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 120 + (i - 8) * 12);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added Next 6 Months releases');

    // This Year (240-360 days)
    for (let i = 13; i < 18; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 240 + (i - 13) * 20);
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], date, Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Added This Year releases');

    const total = await pool.query('SELECT COUNT(*) FROM upcoming_releases');
    console.log(`\n📊 Total upcoming releases: ${total.rows[0].count}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addMoreReleases();
