const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const tvShows = [
  {
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family\'s future as he battles terminal lung cancer.',
    release_date: '2008-01-20',
    runtime: 47,
    poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    average_rating: 9.5,
    rating_count: 2000000,
    type: 'tv_show'
  },
  {
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    release_date: '2011-04-17',
    runtime: 57,
    poster_url: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
    average_rating: 9.3,
    rating_count: 1800000,
    type: 'tv_show'
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    release_date: '2016-07-15',
    runtime: 51,
    poster_url: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    average_rating: 8.7,
    rating_count: 1500000,
    type: 'tv_show'
  },
  {
    title: 'The Crown',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
    release_date: '2016-11-04',
    runtime: 58,
    poster_url: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/wHJxSGJSfXWpPfvZKhq6GkXjLnP.jpg',
    average_rating: 8.6,
    rating_count: 900000,
    type: 'tv_show'
  },
  {
    title: 'The Mandalorian',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    release_date: '2019-11-12',
    runtime: 40,
    poster_url: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/9ijMGlJKqcslswWUzTEwScm82Gs.jpg',
    average_rating: 8.5,
    rating_count: 1200000,
    type: 'tv_show'
  }
];

async function addTVShows() {
  const client = await pool.connect();
  
  try {
    console.log('📺 ADDING TV SHOWS...\n');

    for (const show of tvShows) {
      const result = await client.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, backdrop_url, average_rating, rating_count, type, country) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [show.title, show.description, show.release_date, show.runtime, show.poster_url, show.backdrop_url, show.average_rating, show.rating_count, show.type, 'USA']
      );
      console.log(`✅ Added: ${show.title} (ID: ${result.rows[0].id})`);
    }

    console.log('\n✅ ALL TV SHOWS ADDED!\n');

    const result = await client.query(`SELECT id, title, type FROM movies WHERE type = 'tv_show' ORDER BY id`);
    console.log('📊 TV SHOWS IN DATABASE:\n');
    result.rows.forEach(row => {
      console.log(`${row.id}. ${row.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addTVShows();
