const db = require('./src/config/database');

async function addContent() {
  try {
    console.log('🎬 Adding videos and TV shows...\n');

    // Add videos for existing movies
    console.log('📹 Adding videos...');
    const movies = await db.query('SELECT id, title FROM movies LIMIT 10');
    
    const videoTypes = ['trailer', 'behind_scenes', 'interview', 'clip'];
    
    for (const movie of movies.rows) {
      for (let i = 0; i < 2; i++) {
        const type = videoTypes[Math.floor(Math.random() * videoTypes.length)];
        await db.query(`
          INSERT INTO videos (movie_id, title, video_url, video_type, duration, thumbnail_url, views_count)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING
        `, [
          movie.id,
          `${movie.title} - ${type.replace('_', ' ')}`,
          'dQw4w9WgXcQ',
          type,
          Math.floor(Math.random() * 300) + 60,
          `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          Math.floor(Math.random() * 50000) + 5000
        ]);
      }
    }
    console.log('✅ Videos added\n');

    // Add TV shows
    console.log('📺 Adding TV shows...');
    const tvShows = [
      {
        title: 'Breaking Bad',
        description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.',
        release_date: '2008-01-20',
        runtime: 47,
        poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        type: 'tv_show',
        average_rating: 9.5
      },
      {
        title: 'Game of Thrones',
        description: 'Nine noble families fight for control over the lands of Westeros.',
        release_date: '2011-04-17',
        runtime: 57,
        poster_url: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
        type: 'tv_show',
        average_rating: 9.2
      },
      {
        title: 'Stranger Things',
        description: 'When a young boy disappears, his mother and friends must confront terrifying supernatural forces.',
        release_date: '2016-07-15',
        runtime: 51,
        poster_url: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        type: 'tv_show',
        average_rating: 8.7
      },
      {
        title: 'The Crown',
        description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.',
        release_date: '2016-11-04',
        runtime: 58,
        poster_url: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
        type: 'tv_show',
        average_rating: 8.6
      },
      {
        title: 'The Mandalorian',
        description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.',
        release_date: '2019-11-12',
        runtime: 40,
        poster_url: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
        type: 'tv_show',
        average_rating: 8.7
      },
      {
        title: 'The Office',
        description: 'A mockumentary on a group of typical office workers.',
        release_date: '2005-03-24',
        runtime: 22,
        poster_url: 'https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',
        type: 'tv_show',
        average_rating: 9.0
      },
      {
        title: 'Friends',
        description: 'Follows the personal and professional lives of six friends living in Manhattan.',
        release_date: '1994-09-22',
        runtime: 22,
        poster_url: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg',
        type: 'tv_show',
        average_rating: 8.9
      },
      {
        title: 'The Witcher',
        description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world.',
        release_date: '2019-12-20',
        runtime: 60,
        poster_url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
        type: 'tv_show',
        average_rating: 8.2
      }
    ];

    // Add type column if not exists
    await db.query(`ALTER TABLE movies ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'movie'`);

    for (const show of tvShows) {
      await db.query(`
        INSERT INTO movies (title, description, release_date, runtime, poster_url, type, average_rating, views_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
        show.title,
        show.description,
        show.release_date,
        show.runtime,
        show.poster_url,
        show.type,
        show.average_rating,
        Math.floor(Math.random() * 500000) + 100000
      ]);
    }
    console.log('✅ TV shows added\n');

    // Update existing movies to have type='movie'
    await db.query(`UPDATE movies SET type = 'movie' WHERE type IS NULL`);

    console.log('✅ Content added successfully!\n');
    
    // Show counts
    const movieCount = await db.query("SELECT COUNT(*) FROM movies WHERE type = 'movie'");
    const tvCount = await db.query("SELECT COUNT(*) FROM movies WHERE type = 'tv_show'");
    const videoCount = await db.query("SELECT COUNT(*) FROM videos");
    
    console.log(`📊 Movies: ${movieCount.rows[0].count}`);
    console.log(`📊 TV Shows: ${tvCount.rows[0].count}`);
    console.log(`📊 Videos: ${videoCount.rows[0].count}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addContent();
