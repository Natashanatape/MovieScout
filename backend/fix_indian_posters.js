const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const fixedPosters = [
  { title: 'Scam 1992', poster: 'https://m.media-amazon.com/images/M/MV5BNjgxZTMxNDItZWFkZS00MTRlLTk5ZDQtM2JkZGVjMzVkYzJlXkEyXkFqcGdeQXVyMTAyMTE1MDA1._V1_FMjpg_UX1000_.jpg' },
  { title: 'Panchayat', poster: 'https://m.media-amazon.com/images/M/MV5BODgxNjJkMDUtYjVhNy00ZTRlLWE5YTUtNjM5NDI3MTYxNzE5XkEyXkFqcGdeQXVyMTIxMDk2NDE4._V1_FMjpg_UX1000_.jpg' },
  { title: 'Mirzapur', poster: 'https://m.media-amazon.com/images/M/MV5BZjJjMzY2YTYtNGZkNy00N2Y0LWJmZDYtZGVmZmQyZjZhNjg5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_FMjpg_UX1000_.jpg' },
  { title: 'Sacred Games', poster: 'https://m.media-amazon.com/images/M/MV5BZWQ4ZTNkNzYtZWFjZC00ZmEwLWI4Y2UtZjdkYTRhMWI5ZjI5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_FMjpg_UX1000_.jpg' },
  { title: 'The Kapil Sharma Show', poster: 'https://m.media-amazon.com/images/M/MV5BYzJhMGY3YzktNzY5Zi00ZjI0LWI5YzYtMjQ3ZGQ0ZjQ0ZjQ0XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_FMjpg_UX1000_.jpg' },
  { title: 'Mahabharat', poster: 'https://m.media-amazon.com/images/M/MV5BMTYzNzY5NzY5NV5BMl5BanBnXkFtZTgwNjI5MTcwMzE@._V1_FMjpg_UX1000_.jpg' },
  { title: 'Taarak Mehta Ka Ooltah Chashmah', poster: 'https://m.media-amazon.com/images/M/MV5BZmFjYWYwNzktMzk0Zi00YjQ4LTk3NzAtMGQ3ZGY0NjY5YzJkXkEyXkFqcGdeQXVyODAzNzAwOTU@._V1_FMjpg_UX1000_.jpg' }
];

async function fixIndianPosters() {
  const client = await pool.connect();
  
  try {
    console.log('🇮🇳 Fixing Indian TV Show Posters...\n');
    
    for (const show of fixedPosters) {
      await client.query(
        `UPDATE movies SET poster_url = $1 WHERE title = $2 AND type = 'tv_show'`,
        [show.poster, show.title]
      );
      console.log(`✅ Fixed: ${show.title}`);
    }
    
    console.log('\n🎉 All Indian show posters fixed with unique images!');
    console.log('\n⚠️  Clear browser cache (Ctrl+Shift+Delete) and refresh!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixIndianPosters();
