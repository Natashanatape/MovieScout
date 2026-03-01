const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const correctPosters = [
  { id: 1, poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
  { id: 2, poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
  { id: 3, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 4, poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  { id: 5, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' }
];

async function fixPosters() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 FIXING POSTERS...\n');

    for (const movie of correctPosters) {
      await client.query(
        'UPDATE movies SET poster_url = $1 WHERE id = $2',
        [movie.poster_url, movie.id]
      );
      console.log(`✅ Fixed poster for movie ID ${movie.id}`);
    }

    console.log('\n✅ ALL POSTERS FIXED!\n');

    const result = await client.query(`
      SELECT id, title, poster_url 
      FROM movies 
      WHERE id BETWEEN 1 AND 11
      ORDER BY id
    `);
    
    console.log('📊 UPDATED POSTERS:\n');
    result.rows.forEach(row => {
      console.log(`${row.id}. ${row.title}`);
      console.log(`   ${row.poster_url}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixPosters();
