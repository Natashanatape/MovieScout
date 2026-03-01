require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupTVEpisodes() {
  try {
    console.log('📺 Setting up TV Episode Guide...');

    // Create tv_seasons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tv_seasons (
        id SERIAL PRIMARY KEY,
        tv_show_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        season_number INTEGER NOT NULL,
        overview TEXT,
        air_date DATE,
        episode_count INTEGER DEFAULT 0,
        poster_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create tv_episodes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tv_episodes (
        id SERIAL PRIMARY KEY,
        season_id INTEGER REFERENCES tv_seasons(id) ON DELETE CASCADE,
        episode_number INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        air_date DATE,
        runtime INTEGER,
        still_path VARCHAR(500),
        rating DECIMAL(3,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create episode_watch_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS episode_watch_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        episode_id INTEGER REFERENCES tv_episodes(id) ON DELETE CASCADE,
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, episode_id)
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tv_seasons_show ON tv_seasons(tv_show_id);
      CREATE INDEX IF NOT EXISTS idx_tv_episodes_season ON tv_episodes(season_id);
      CREATE INDEX IF NOT EXISTS idx_episode_watch_user ON episode_watch_history(user_id);
    `);

    console.log('✅ Tables created');

    // Get TV shows
    const tvShows = await pool.query(`
      SELECT id, title FROM movies WHERE type = 'tv' LIMIT 3
    `);

    if (tvShows.rows.length === 0) {
      console.log('❌ No TV shows found');
      return;
    }

    // Add sample seasons and episodes
    for (const show of tvShows.rows) {
      // Add 2 seasons
      for (let s = 1; s <= 2; s++) {
        const seasonResult = await pool.query(`
          INSERT INTO tv_seasons (tv_show_id, season_number, overview, episode_count)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `, [show.id, s, `Season ${s} of ${show.title}`, 10]);

        const seasonId = seasonResult.rows[0].id;

        // Add 10 episodes per season
        for (let e = 1; e <= 10; e++) {
          const airDate = new Date();
          airDate.setDate(airDate.getDate() - (20 - s) * 7 - e);

          await pool.query(`
            INSERT INTO tv_episodes (season_id, episode_number, title, overview, air_date, runtime, rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            seasonId,
            e,
            `Episode ${e}`,
            `Episode ${e} of Season ${s}`,
            airDate.toISOString().split('T')[0],
            45,
            (Math.random() * 3 + 7).toFixed(1)
          ]);
        }

        console.log(`✅ Added Season ${s} for: ${show.title}`);
      }
    }

    console.log(`\n✅ TV Episode Guide setup complete!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupTVEpisodes();
