require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addTVShows() {
  try {
    console.log('📺 Adding TV shows...');

    const tvShows = [
      {
        title: 'Breaking Bad',
        description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.',
        poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        release_date: '2008-01-20',
        runtime: 47,
        language: 'English',
        country: 'USA'
      },
      {
        title: 'Game of Thrones',
        description: 'Nine noble families fight for control over the lands of Westeros.',
        poster_url: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
        release_date: '2011-04-17',
        runtime: 60,
        language: 'English',
        country: 'USA'
      },
      {
        title: 'Stranger Things',
        description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
        poster_url: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        release_date: '2016-07-15',
        runtime: 51,
        language: 'English',
        country: 'USA'
      }
    ];

    for (const show of tvShows) {
      await pool.query(`
        INSERT INTO movies (title, description, poster_url, release_date, runtime, type, language, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [show.title, show.description, show.poster_url, show.release_date, show.runtime, 'tv', show.language, show.country]);

      console.log(`✅ Added: ${show.title}`);
    }

    console.log(`\n✅ Added ${tvShows.length} TV shows`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addTVShows();
