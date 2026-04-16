const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addMoreMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🎬 Adding more movies for complete homepage...\n');
    
    // Additional movies to fill all sections
    const moreMovies = [
      // Trending movies
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        release_date: '1994-09-23',
        runtime: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        average_rating: 9.3,
        rating_count: 2500000,
        type: 'movie'
      },
      {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        release_date: '1972-03-24',
        runtime: 175,
        poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        average_rating: 9.2,
        rating_count: 1800000,
        type: 'movie'
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.',
        release_date: '2008-07-18',
        runtime: 152,
        poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        average_rating: 9.0,
        rating_count: 2600000,
        type: 'movie'
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        release_date: '1994-10-14',
        runtime: 154,
        poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        average_rating: 8.9,
        rating_count: 2000000,
        type: 'movie'
      },
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        release_date: '1994-07-06',
        runtime: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        average_rating: 8.8,
        rating_count: 2100000,
        type: 'movie'
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        release_date: '2010-07-16',
        runtime: 148,
        poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        average_rating: 8.8,
        rating_count: 2300000,
        type: 'movie'
      },
      {
        title: 'The Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        release_date: '1999-03-31',
        runtime: 136,
        poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        average_rating: 8.7,
        rating_count: 1900000,
        type: 'movie'
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        release_date: '2014-11-07',
        runtime: 169,
        poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        average_rating: 8.6,
        rating_count: 1700000,
        type: 'movie'
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions.',
        release_date: '2019-04-26',
        runtime: 181,
        poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        average_rating: 8.4,
        rating_count: 2800000,
        type: 'movie'
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.',
        release_date: '2021-12-17',
        runtime: 148,
        poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        average_rating: 8.2,
        rating_count: 1500000,
        type: 'movie'
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
        release_date: '2022-05-27',
        runtime: 130,
        poster_url: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        average_rating: 8.3,
        rating_count: 1200000,
        type: 'movie'
      },
      {
        title: 'Dune',
        description: 'Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.',
        release_date: '2021-10-22',
        runtime: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
        average_rating: 8.0,
        rating_count: 1100000,
        type: 'movie'
      },
      {
        title: 'Titanic',
        description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        release_date: '1997-12-19',
        runtime: 194,
        poster_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        average_rating: 7.9,
        rating_count: 1000000,
        type: 'movie'
      },
      {
        title: 'Avatar',
        description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.',
        release_date: '2009-12-18',
        runtime: 162,
        poster_url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
        average_rating: 7.8,
        rating_count: 1300000,
        type: 'movie'
      },
      {
        title: 'The Lion King',
        description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
        release_date: '1994-06-24',
        runtime: 88,
        poster_url: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
        average_rating: 8.5,
        rating_count: 900000,
        type: 'movie'
      },
      {
        title: 'Jurassic Park',
        description: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids.',
        release_date: '1993-06-11',
        runtime: 127,
        poster_url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg',
        average_rating: 8.1,
        rating_count: 850000,
        type: 'movie'
      },
      {
        title: 'Gladiator',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
        release_date: '2000-05-05',
        runtime: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        average_rating: 8.5,
        rating_count: 1400000,
        type: 'movie'
      },
      {
        title: 'The Prestige',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.',
        release_date: '2006-10-20',
        runtime: 130,
        poster_url: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg',
        average_rating: 8.5,
        rating_count: 1200000,
        type: 'movie'
      },
      {
        title: 'The Departed',
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.',
        release_date: '2006-10-06',
        runtime: 151,
        poster_url: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg',
        average_rating: 8.5,
        rating_count: 1100000,
        type: 'movie'
      },
      {
        title: 'Whiplash',
        description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.',
        release_date: '2014-10-10',
        runtime: 106,
        poster_url: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
        average_rating: 8.5,
        rating_count: 800000,
        type: 'movie'
      }
    ];

    console.log('📝 Inserting additional movies...\n');
    let added = 0;
    
    for (const movie of moreMovies) {
      try {
        // Check if movie already exists
        const existing = await client.query(
          'SELECT id FROM movies WHERE title = $1',
          [movie.title]
        );
        
        if (existing.rows.length === 0) {
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
          added++;
        } else {
          console.log(`⏭️  Skipped: ${movie.title} (already exists)`);
        }
      } catch (err) {
        console.log(`❌ Error adding ${movie.title}:`, err.message);
      }
    }

    console.log(`\n✨ Complete! Added ${added} new movies`);
    
    // Show total count
    const countResult = await client.query('SELECT COUNT(*) FROM movies');
    console.log(`📊 Total movies in database: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addMoreMovies();
