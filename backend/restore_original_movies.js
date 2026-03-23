const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MovieScout',
  password: 'postgres',
  port: 5432,
});

const originalMovies = [
  { title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', date: '1994-09-23', runtime: 142, poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', rating: 9.3, views: 2500000 },
  { title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', date: '1972-03-24', runtime: 175, poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', rating: 9.2, views: 1800000 },
  { title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', date: '2008-07-18', runtime: 152, poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, views: 2600000 },
  { title: 'Pulp Fiction', desc: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', date: '1994-10-14', runtime: 154, poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', rating: 8.9, views: 2000000 },
  { title: 'Forrest Gump', desc: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.', date: '1994-07-06', runtime: 142, poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', rating: 8.8, views: 2100000 },
  { title: 'Inception', desc: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', date: '2010-07-16', runtime: 148, poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 8.8, views: 2300000 },
  { title: 'The Matrix', desc: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', date: '1999-03-31', runtime: 136, poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', rating: 8.7, views: 1900000 },
  { title: 'Interstellar', desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', date: '2014-11-07', runtime: 169, poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.6, views: 1700000 }
];

async function restoreOriginalMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Restoring original movies...\n');
    
    for (const movie of originalMovies) {
      try {
        await client.query(
          `INSERT INTO movies (title, description, release_date, runtime, poster_url, type, average_rating, rating_count)
           VALUES ($1, $2, $3, $4, $5, 'movie', $6, $7)`,
          [movie.title, movie.desc, movie.date, movie.runtime, movie.poster, movie.rating, movie.views]
        );
        console.log(`  ✅ ${movie.title}`);
      } catch (err) {
        if (err.code === '23505') {
          console.log(`  ⚠️  ${movie.title} (already exists)`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('\n✅ Original movies restored!');
    console.log('✅ Homepage is back to normal!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

restoreOriginalMovies();
