const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixNewReleases() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing New Releases with downloaded images...');
    
    // New releases data with local images
    const newReleases = [
      {
        title: 'Gully Boy',
        description: 'A coming-of-age story based on the lives of street rappers in Mumbai.',
        release_date: '2019-02-14',
        runtime: 154,
        poster_url: 'http://localhost:5001/images/gullyboy.jpg',
        average_rating: 7.9,
        rating_count: 45000,
        type: 'movie'
      },
      {
        title: 'Bajrangi Bhaijaan',
        description: 'An Indian man with a magnanimous heart takes a young mute Pakistani girl back to her homeland to reunite her with her family.',
        release_date: '2015-07-17',
        runtime: 163,
        poster_url: 'http://localhost:5001/images/BajrangiBhaijaan.jpg',
        average_rating: 8.1,
        rating_count: 98000,
        type: 'movie'
      },
      {
        title: 'Zindagi Na Milegi Dobara',
        description: 'Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged.',
        release_date: '2011-07-15',
        runtime: 155,
        poster_url: 'http://localhost:5001/images/zindaginamilegidubara.jpg',
        average_rating: 8.2,
        rating_count: 87000,
        type: 'movie'
      },
      {
        title: 'Lagaan',
        description: 'The people of a small village in Victorian India stake their future on a game of cricket against their ruthless British rulers.',
        release_date: '2001-06-15',
        runtime: 224,
        poster_url: 'https://image.tmdb.org/t/p/w500/w3NkN8rNGCJLNs1V4Y8FJNcgLqB.jpg',
        average_rating: 8.1,
        rating_count: 112000,
        type: 'movie'
      },
      {
        title: "Schindler's List",
        description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
        release_date: '1993-12-15',
        runtime: 195,
        poster_url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
        average_rating: 9.0,
        rating_count: 1350000,
        type: 'movie'
      },
      {
        title: 'Dangal',
        description: 'Former wrestler Mahavir Singh Phogat trains his daughters Geeta Phogat and Babita Kumari to become India\'s first world-class female wrestlers.',
        release_date: '2016-12-23',
        runtime: 161,
        poster_url: 'https://image.tmdb.org/t/p/w500/lWcAVj5GhOKjNJ9bKhz5NApkSVl.jpg',
        average_rating: 8.3,
        rating_count: 195000,
        type: 'movie'
      },
      {
        title: '3 Idiots',
        description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.',
        release_date: '2009-12-25',
        runtime: 170,
        poster_url: 'http://localhost:5001/images/3iditios.jpg',
        average_rating: 8.4,
        rating_count: 425000,
        type: 'movie'
      },
      {
        title: 'Andhadhun',
        description: 'A series of mysterious events change the life of a blind pianist who now must report a crime that was actually never witnessed by him.',
        release_date: '2018-10-05',
        runtime: 139,
        poster_url: 'http://localhost:5001/images/Andhadhun.jpg',
        average_rating: 8.2,
        rating_count: 89000,
        type: 'movie'
      },
      {
        title: 'Drishyam',
        description: 'Desperate measures are taken by a man who tries to save his family from the dark side of the law, after they commit an unexpected crime.',
        release_date: '2015-07-31',
        runtime: 163,
        poster_url: 'http://localhost:5001/images/Drishyam.jpg',
        average_rating: 8.2,
        rating_count: 78000,
        type: 'movie'
      }
    ];

    // First, delete existing movies to avoid duplicates
    console.log('🗑️  Clearing old data...');
    await client.query('DELETE FROM movies WHERE title IN ($1, $2, $3, $4, $5, $6, $7, $8, $9)', 
      newReleases.map(m => m.title));

    // Insert new releases
    console.log('📝 Inserting new releases...');
    for (const movie of newReleases) {
      const result = await client.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, average_rating, rating_count, type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING id`,
        [
          movie.title,
          movie.description,
          movie.release_date,
          movie.runtime,
          movie.poster_url,
          movie.average_rating,
          movie.rating_count,
          movie.type
        ]
      );
      console.log(`✅ Added: ${movie.title} (ID: ${result.rows[0].id})`);
    }

    console.log('✨ New releases fixed successfully!');
    console.log('📊 Total movies added:', newReleases.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixNewReleases();
