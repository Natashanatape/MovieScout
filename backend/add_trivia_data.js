const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function addTriviaData() {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO trivia (movie_id, user_id, trivia_text, upvotes, downvotes, status, created_at) VALUES
      (1, 1, 'The entire movie was shot in just 28 days with a budget of only $15 million.', 45, 2, 'approved', NOW() - INTERVAL '5 days'),
      (1, 2, 'The director insisted on using practical effects instead of CGI for most action scenes.', 38, 1, 'approved', NOW() - INTERVAL '3 days'),
      (1, 3, 'The lead actor performed all of his own stunts without a body double.', 52, 3, 'approved', NOW() - INTERVAL '2 days'),
      (2, 1, 'Over 500 extras were used in the final battle scene.', 41, 1, 'approved', NOW() - INTERVAL '4 days'),
      (2, 2, 'The iconic soundtrack was composed in less than two weeks.', 35, 2, 'approved', NOW() - INTERVAL '6 days'),
      (3, 1, 'The movie was filmed in 5 different countries across 3 continents.', 29, 1, 'approved', NOW() - INTERVAL '1 day'),
      (3, 3, 'The script went through 12 rewrites before final production.', 33, 0, 'approved', NOW() - INTERVAL '7 days'),
      (4, 2, 'The costume department created over 200 unique outfits for the film.', 27, 1, 'approved', NOW() - INTERVAL '3 days'),
      (5, 1, 'The opening scene was shot in a single continuous take lasting 8 minutes.', 48, 2, 'approved', NOW() - INTERVAL '2 days'),
      (6, 3, 'The movie broke box office records in its opening weekend.', 55, 1, 'approved', NOW() - INTERVAL '1 day')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Sample trivia/facts added successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addTriviaData();
