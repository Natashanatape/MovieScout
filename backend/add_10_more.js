const db = require('./src/config/database');

const add10MoreMovies = async () => {
  try {
    const movies = [
      {
        title: 'The Usual Suspects',
        description: 'A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.',
        release_date: '1995-08-16',
        runtime: 106,
        poster_url: 'https://image.tmdb.org/t/p/w500/9Xw0I5RV2ZqNLpul6lMcsJVfoCd.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/ba4BYqmM0XvXUW0mHOb8LGvJRXV.jpg',
        average_rating: 8.5,
        rating_count: 1200000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Se7en',
        description: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
        release_date: '1995-09-22',
        runtime: 127,
        poster_url: 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg',
        average_rating: 8.6,
        rating_count: 1500000,
        genres: ['Thriller', 'Horror']
      },
      {
        title: 'The Sixth Sense',
        description: 'A boy who communicates with spirits seeks the help of a disheartened child psychologist.',
        release_date: '1999-08-06',
        runtime: 107,
        poster_url: 'https://image.tmdb.org/t/p/w500/4AfSDjjCy6T5LA1TMz0Lh2HlpRs.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/3Iy1lZ5BpmXFZwVz5P0bZU4DKLx.jpg',
        average_rating: 8.1,
        rating_count: 1000000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Memento',
        description: 'A man with short-term memory loss attempts to track down his wife\'s murderer.',
        release_date: '2000-10-11',
        runtime: 113,
        poster_url: 'https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/9FeLdGHhRVBa7qKPyZZq3bVVPdC.jpg',
        average_rating: 8.4,
        rating_count: 1200000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'The Truman Show',
        description: 'An insurance salesman discovers his whole life is actually a reality TV show.',
        release_date: '1998-06-05',
        runtime: 103,
        poster_url: 'https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/s03JYY0kVBqRlFD0VmPPJrYSJmN.jpg',
        average_rating: 8.1,
        rating_count: 1000000,
        genres: ['Drama', 'Sci-Fi']
      },
      {
        title: 'Gladiator',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
        release_date: '2000-05-05',
        runtime: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
        average_rating: 8.5,
        rating_count: 1400000,
        genres: ['Action', 'Drama']
      },
      {
        title: 'The Departed',
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang.',
        release_date: '2006-10-06',
        runtime: 151,
        poster_url: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/8Od5zV93Av7JPQYcCbRk73piLMJ.jpg',
        average_rating: 8.5,
        rating_count: 1200000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Jurassic Park',
        description: 'A pragmatic paleontologist touring an almost complete theme park on an island is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.',
        release_date: '1993-06-11',
        runtime: 127,
        poster_url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/oSKxnrSfWu1h4L0ASjpvOvH0yYC.jpg',
        average_rating: 8.1,
        rating_count: 1500000,
        genres: ['Adventure', 'Sci-Fi', 'Action']
      },
      {
        title: 'Avatar',
        description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
        release_date: '2009-12-18',
        runtime: 162,
        poster_url: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg',
        average_rating: 7.9,
        rating_count: 2800000,
        genres: ['Sci-Fi', 'Adventure', 'Action']
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission.',
        release_date: '2022-05-27',
        runtime: 131,
        poster_url: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg',
        average_rating: 8.3,
        rating_count: 1200000,
        genres: ['Action', 'Drama']
      }
    ];

    console.log('🎬 Adding 10 more Hollywood movies...\n');

    for (const movie of movies) {
      const checkExisting = await db.query('SELECT id FROM movies WHERE title = $1', [movie.title]);
      
      if (checkExisting.rows.length > 0) {
        console.log(`⚠️  Skipped (already exists): ${movie.title}`);
        continue;
      }

      const result = await db.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, backdrop_url, average_rating, rating_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [movie.title, movie.description, movie.release_date, movie.runtime, movie.poster_url, movie.backdrop_url, movie.average_rating, movie.rating_count]
      );
      
      const movieId = result.rows[0].id;
      
      for (const genreName of movie.genres) {
        const genreResult = await db.query('SELECT id FROM genres WHERE name = $1', [genreName]);
        if (genreResult.rows.length > 0) {
          await db.query(
            'INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)',
            [movieId, genreResult.rows[0].id]
          );
        }
      }
      console.log(`✅ Added: ${movie.title}`);
    }

    console.log('\n✅ Successfully added more Hollywood movies!');
    
  } catch (error) {
    console.error('❌ Error adding movies:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

add10MoreMovies();
