const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkEpisodes() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM tv_episodes');
    console.log(`\n📺 Total Episodes in Database: ${result.rows[0].count}\n`);
    
    const shows = await pool.query('SELECT id, title FROM movies WHERE type = $1 LIMIT 5', ['tv_show']);
    console.log('Sample TV Shows:');
    shows.rows.forEach(show => {
      console.log(`- ${show.title} (ID: ${show.id})`);
    });
    
    if (shows.rows.length > 0) {
      const firstShow = shows.rows[0];
      const eps = await pool.query('SELECT COUNT(*) FROM tv_episodes WHERE show_id = $1', [firstShow.id]);
      console.log(`\nEpisodes for "${firstShow.title}": ${eps.rows[0].count}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEpisodes();
