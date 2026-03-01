const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const trailerKeys = [
  'dQw4w9WgXcQ', 'kJQP7kiw5Fk', '3tmd-ClpJxA', 'YQHsXMglC9A',
  'hA6hldpSTF8', 'TcMBFSGVi1c', 'giXco2jaZ_4', 'mqqft2x_Aa4'
];

async function addTVVideos() {
  try {
    const shows = await pool.query("SELECT id, title FROM movies WHERE type = 'tv_show'");
    
    console.log(`\n📺 Adding videos for ${shows.rows.length} TV shows...\n`);

    for (const show of shows.rows) {
      // Add 3 videos per show
      for (let i = 0; i < 3; i++) {
        const types = ['Trailer', 'Teaser', 'Behind the Scenes'];
        await pool.query(`
          INSERT INTO videos (movie_id, title, video_url, video_type, source)
          VALUES ($1, $2, $3, $4, 'YouTube')
        `, [
          show.id,
          `${show.title} - ${types[i]}`,
          `https://www.youtube.com/watch?v=${trailerKeys[Math.floor(Math.random() * trailerKeys.length)]}`,
          types[i]
        ]);
      }
      console.log(`✓ ${show.title}`);
    }

    console.log('\n✅ All TV shows now have videos!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTVVideos();
