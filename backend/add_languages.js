const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function addLanguages() {
  const client = await pool.connect();
  
  try {
    console.log('🌍 Adding language support...\n');

    // Add language column
    await client.query(`
      ALTER TABLE movies ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English'
    `);
    console.log('✅ Language column added\n');

    // Update existing movies with languages
    const updates = [
      { id: 1, language: 'English' },  // Shawshank
      { id: 2, language: 'English' },  // Godfather
      { id: 3, language: 'English' },  // Dark Knight
      { id: 4, language: 'English' },  // Pulp Fiction
      { id: 5, language: 'English' },  // Inception
      { id: 6, language: 'English' },  // Fight Club
      { id: 7, language: 'English' },  // Forrest Gump
      { id: 8, language: 'English' },  // Matrix
      { id: 9, language: 'English' },  // Hangover
      { id: 10, language: 'English' }, // Conjuring
      { id: 11, language: 'English' }, // Indiana Jones
      { id: 12, language: 'English' }, // Breaking Bad
      { id: 13, language: 'English' }, // Game of Thrones
      { id: 14, language: 'English' }, // Friends
      { id: 15, language: 'English' }, // Stranger Things
      { id: 16, language: 'Spanish' }  // Money Heist
    ];

    for (const update of updates) {
      await client.query(
        'UPDATE movies SET language = $1 WHERE id = $2',
        [update.language, update.id]
      );
    }
    console.log('✅ Existing movies updated\n');

    // Add Hindi/Indian movies
    const indianMovies = [
      {
        title: '3 Idiots',
        description: 'Two friends embark on a quest for a lost buddy. On this journey, they encounter a long forgotten bet, a wedding they must crash, and a funeral that goes impossibly out of control.',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        release_date: '2009-12-25',
        runtime: 170,
        language: 'Hindi',
        type: 'movie'
      },
      {
        title: 'Dangal',
        description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_.jpg',
        release_date: '2016-12-23',
        runtime: 161,
        language: 'Hindi',
        type: 'movie'
      },
      {
        title: 'PK',
        description: 'An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYzOTE2NjkxN15BMl5BanBnXkFtZTgwMDgzMTg0MzE@._V1_.jpg',
        release_date: '2014-12-19',
        runtime: 153,
        language: 'Hindi',
        type: 'movie'
      },
      {
        title: 'Baahubali: The Beginning',
        description: 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BYTJmZjU5ZTktNjQ5MC00NTI5LWE0ZDUtNzE4YjQ4ZjZhMGY0XkEyXkFqcGdeQXVyNjQ2MjQ5NzM@._V1_.jpg',
        release_date: '2015-07-10',
        runtime: 159,
        language: 'Telugu',
        type: 'movie'
      },
      {
        title: 'KGF Chapter 1',
        description: 'In the 1970s, a gangster named Rocky goes undercover as a slave to assassinate the owner of a notorious gold mine known as the Kolar Gold Fields.',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTc1NDM4MTYxN15BMl5BanBnXkFtZTgwMzE0NzE4NjM@._V1_.jpg',
        release_date: '2018-12-21',
        runtime: 156,
        language: 'Kannada',
        type: 'movie'
      },
      {
        title: 'Sairat',
        description: 'A young couple in love face opposition from their families due to their different castes.',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYwNjQ4NjY5NF5BMl5BanBnXkFtZTgwNzE2NjQ4ODE@._V1_.jpg',
        release_date: '2016-04-29',
        runtime: 174,
        language: 'Marathi',
        type: 'movie'
      }
    ];

    console.log('📽️ Adding Indian movies...\n');
    
    for (const movie of indianMovies) {
      const result = await client.query(
        `INSERT INTO movies (title, description, poster_url, release_date, runtime, language, type) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, language`,
        [movie.title, movie.description, movie.poster_url, movie.release_date, movie.runtime, movie.language, movie.type]
      );
      console.log(`✅ Added: ${result.rows[0].title} (${result.rows[0].language})`);
    }

    console.log('\n🎉 LANGUAGE SETUP COMPLETE!\n');

    // Show summary
    const summary = await client.query(`
      SELECT language, COUNT(*) as count 
      FROM movies 
      GROUP BY language 
      ORDER BY count DESC
    `);
    
    console.log('📊 Movies by Language:');
    summary.rows.forEach(row => {
      console.log(`  ${row.language}: ${row.count} movies`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addLanguages();
