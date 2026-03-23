const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function addFeedData() {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO activity_feed (user_id, activity_type, target_id, target_type, created_at) VALUES
      (1, 'rating', 1, 'movie', NOW() - INTERVAL '2 hours'),
      (2, 'review', 2, 'movie', NOW() - INTERVAL '5 hours'),
      (1, 'watchlist', 3, 'movie', NOW() - INTERVAL '1 day'),
      (3, 'rating', 4, 'movie', NOW() - INTERVAL '3 hours'),
      (2, 'review', 1, 'movie', NOW() - INTERVAL '6 hours'),
      (3, 'watchlist', 5, 'movie', NOW() - INTERVAL '12 hours'),
      (1, 'rating', 6, 'movie', NOW() - INTERVAL '8 hours'),
      (2, 'rating', 7, 'movie', NOW() - INTERVAL '4 hours'),
      (1, 'review', 8, 'movie', NOW() - INTERVAL '10 hours'),
      (3, 'rating', 2, 'movie', NOW() - INTERVAL '15 hours')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Activity feed data added successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addFeedData();
