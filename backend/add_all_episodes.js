const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addEpisodesForAllShows() {
  try {
    // Get all TV shows without seasons
    const shows = await pool.query(`
      SELECT m.id, m.title 
      FROM movies m 
      WHERE m.type = 'tv_show' 
      AND m.id NOT IN (SELECT DISTINCT tv_show_id FROM tv_seasons)
    `);

    console.log(`\n📺 Found ${shows.rows.length} TV shows without episodes\n`);

    for (const show of shows.rows) {
      console.log(`Adding episodes for: ${show.title}`);
      
      // Add 2 seasons
      for (let seasonNum = 1; seasonNum <= 2; seasonNum++) {
        const seasonResult = await pool.query(`
          INSERT INTO tv_seasons (tv_show_id, season_number, episode_count, air_date)
          VALUES ($1, $2, $3, CURRENT_DATE)
          RETURNING id
        `, [show.id, seasonNum, 10]);

        const seasonId = seasonResult.rows[0].id;

        // Add 10 episodes per season
        for (let epNum = 1; epNum <= 10; epNum++) {
          await pool.query(`
            INSERT INTO tv_episodes (season_id, episode_number, title, air_date, runtime, overview, rating)
            VALUES ($1, $2, $3, CURRENT_DATE, 45, $4, ${Math.random() * 3 + 7})
          `, [
            seasonId,
            epNum,
            `Episode ${epNum}`,
            `This is episode ${epNum} of season ${seasonNum}`
          ]);
        }
      }
    }

    console.log('\n✅ All TV shows now have episodes!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addEpisodesForAllShows();
