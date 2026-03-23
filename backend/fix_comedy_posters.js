const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixComedyPosters() {
  try {
    const updates = [
      {
        title: '3 Idiots',
        poster_url: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8IC0.jpg'
      },
      {
        title: 'Zindagi Na Milegi Dobara',
        poster_url: 'https://image.tmdb.org/t/p/w500/8LqXqNDiAdPKKmBXOG6B87dCqCN.jpg'
      },
      {
        title: 'The Hangover',
        poster_url: 'https://image.tmdb.org/t/p/w500/wwjcD1C8XEKTLmh9nvmRLCnUMC9.jpg'
      }
    ];

    for (const movie of updates) {
      await pool.query(
        'UPDATE movies SET poster_url = $1 WHERE title = $2',
        [movie.poster_url, movie.title]
      );
      console.log(`Updated poster for: ${movie.title}`);
    }

    console.log('Comedy movie posters fixed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixComedyPosters();