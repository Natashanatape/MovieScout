const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function addPoll() {
  const client = await pool.connect();
  try {
    // Add 4th poll
    const pollResult = await client.query(`
      INSERT INTO polls (title, description, created_by, created_at)
      VALUES ('Most Anticipated 2024 Movie?', 'Which upcoming movie are you most excited for?', 1, NOW())
      RETURNING id;
    `);
    
    const pollId = pollResult.rows[0].id;
    
    // Add options
    await client.query(`
      INSERT INTO poll_options (poll_id, option_text, vote_count) VALUES
      ($1, 'Dune: Part Two', 95),
      ($1, 'Deadpool 3', 110),
      ($1, 'Joker 2', 85),
      ($1, 'Gladiator 2', 70);
    `, [pollId]);
    
    console.log('✅ 4th poll added successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addPoll();
