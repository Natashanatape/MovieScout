const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixDateDistribution() {
  try {
    console.log('🔧 Fixing date distribution...\n');

    // Clear existing
    await pool.query('DELETE FROM upcoming_releases');
    console.log('✅ Cleared existing releases\n');

    const moviesResult = await pool.query(`
      SELECT id, title FROM movies 
      WHERE type = 'movie' OR type IS NULL
      ORDER BY id 
      LIMIT 20
    `);
    
    const movies = moviesResult.rows;
    const today = new Date();
    
    // This Month (0-30 days) - 3 movies
    console.log('Adding This Month (0-30 days):');
    for (let i = 0; i < 3 && i < movies.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 5 + (i * 8));
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
      `, [movies[i].id, date, 80 + i * 5]);
      console.log(`  ✓ ${movies[i].title} - ${date.toISOString().split('T')[0]}`);
    }
    
    // Next 3 Months (31-90 days) - 4 movies
    console.log('\nAdding Next 3 Months (31-90 days):');
    for (let i = 3; i < 7 && i < movies.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 35 + ((i - 3) * 15));
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
      `, [movies[i].id, date, 70 + i * 3]);
      console.log(`  ✓ ${movies[i].title} - ${date.toISOString().split('T')[0]}`);
    }
    
    // Next 6 Months (91-180 days) - 5 movies
    console.log('\nAdding Next 6 Months (91-180 days):');
    for (let i = 7; i < 12 && i < movies.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 100 + ((i - 7) * 15));
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
      `, [movies[i].id, date, 60 + i * 2]);
      console.log(`  ✓ ${movies[i].title} - ${date.toISOString().split('T')[0]}`);
    }
    
    // This Year (181-365 days) - 5 movies
    console.log('\nAdding This Year (181-365 days):');
    for (let i = 12; i < 17 && i < movies.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + 200 + ((i - 12) * 30));
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, 'theatrical', $3)
      `, [movies[i].id, date, 50 + i]);
      console.log(`  ✓ ${movies[i].title} - ${date.toISOString().split('T')[0]}`);
    }

    const total = await pool.query('SELECT COUNT(*) FROM upcoming_releases');
    console.log(`\n📊 Total: ${total.rows[0].count} movies added\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDateDistribution();
