const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addTVTrailers() {
  try {
    // First get the TV show IDs
    const showsResult = await pool.query("SELECT id, title FROM movies WHERE type = 'tv'");
    const shows = showsResult.rows;

    const trailers = [
      { title: 'Breaking Bad', video_url: 'https://www.youtube.com/watch?v=HhesaQXLuRY', video_type: 'Trailer' },
      { title: 'Game of Thrones', video_url: 'https://www.youtube.com/watch?v=rlR4PJn8b8I', video_type: 'Trailer' },
      { title: 'Stranger Things', video_url: 'https://www.youtube.com/watch?v=b9EkMc79ZSU', video_type: 'Trailer' },
      { title: 'The Office', video_url: 'https://www.youtube.com/watch?v=LHOtME2DL4g', video_type: 'Trailer' },
      { title: 'Friends', video_url: 'https://www.youtube.com/watch?v=hDNNmeeJs1Q', video_type: 'Trailer' },
      { title: 'The Crown', video_url: 'https://www.youtube.com/watch?v=JWtnJjn6ng0', video_type: 'Trailer' },
      { title: 'Money Heist', video_url: 'https://www.youtube.com/watch?v=_InqQJRqGW4', video_type: 'Trailer' },
      { title: 'The Mandalorian', video_url: 'https://www.youtube.com/watch?v=aOC8E8z_ifw', video_type: 'Trailer' },
      { title: 'Sherlock', video_url: 'https://www.youtube.com/watch?v=xK7S9mrFWL4', video_type: 'Trailer' },
      { title: 'The Witcher', video_url: 'https://www.youtube.com/watch?v=ndl1W4ltcmg', video_type: 'Trailer' }
    ];

    for (const trailer of trailers) {
      const show = shows.find(s => s.title === trailer.title);
      if (show) {
        await pool.query(
          `INSERT INTO videos (movie_id, title, video_url, video_type, thumbnail_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [show.id, `${trailer.title} - ${trailer.video_type}`, trailer.video_url, trailer.video_type, '']
        );
        console.log(`Added trailer for: ${trailer.title}`);
      }
    }

    console.log('Successfully added TV show trailers!');
  } catch (error) {
    console.error('Error adding trailers:', error);
  } finally {
    await pool.end();
  }
}

addTVTrailers();