const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const tvShows = [
  {
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine manufacturer.',
    release_date: '2008-01-20',
    runtime: 47,
    poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    type: 'tv',
    average_rating: 9.5,
    rating_count: 1800000
  },
  {
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros.',
    release_date: '2011-04-17',
    runtime: 57,
    poster_url: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    type: 'tv',
    average_rating: 9.3,
    rating_count: 2000000
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
    release_date: '2016-07-15',
    runtime: 51,
    poster_url: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    type: 'tv',
    average_rating: 8.7,
    rating_count: 1200000
  },
  {
    title: 'The Office',
    description: 'A mockumentary on a group of typical office workers.',
    release_date: '2005-03-24',
    runtime: 22,
    poster_url: 'https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',
    type: 'tv',
    average_rating: 9.0,
    rating_count: 900000
  },
  {
    title: 'Friends',
    description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends.',
    release_date: '1994-09-22',
    runtime: 22,
    poster_url: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg',
    type: 'tv',
    average_rating: 8.9,
    rating_count: 1500000
  },
  {
    title: 'The Crown',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.',
    release_date: '2016-11-04',
    runtime: 58,
    poster_url: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
    type: 'tv',
    average_rating: 8.6,
    rating_count: 400000
  },
  {
    title: 'Money Heist',
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.',
    release_date: '2017-05-02',
    runtime: 67,
    poster_url: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
    type: 'tv',
    average_rating: 8.3,
    rating_count: 800000
  },
  {
    title: 'The Mandalorian',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.',
    release_date: '2019-11-12',
    runtime: 40,
    poster_url: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
    type: 'tv',
    average_rating: 8.7,
    rating_count: 600000
  },
  {
    title: 'Sherlock',
    description: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.',
    release_date: '2010-07-25',
    runtime: 88,
    poster_url: 'https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg',
    type: 'tv',
    average_rating: 9.1,
    rating_count: 700000
  },
  {
    title: 'The Witcher',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    release_date: '2019-12-20',
    runtime: 60,
    poster_url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    type: 'tv',
    average_rating: 8.2,
    rating_count: 500000
  }
];

async function addTVShows() {
  try {
    for (const show of tvShows) {
      await pool.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, type, average_rating, rating_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [show.title, show.description, show.release_date, show.runtime, show.poster_url, show.type, show.average_rating, show.rating_count]
      );
      console.log(`Added: ${show.title}`);
    }
    console.log(`Successfully added ${tvShows.length} TV shows!`);
  } catch (error) {
    console.error('Error adding TV shows:', error);
  } finally {
    await pool.end();
  }
}

addTVShows();