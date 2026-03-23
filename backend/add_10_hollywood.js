const db = require('./src/config/database');

const add10MoreMovies = async () => {
  try {
    const movies = [
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        release_date: '1994-09-23',
        runtime: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
        average_rating: 9.3,
        rating_count: 2500000,
        genres: ['Drama']
      },
      {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        release_date: '1972-03-24',
        runtime: 175,
        poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
        average_rating: 9.2,
        rating_count: 1800000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        release_date: '2008-07-18',
        runtime: 152,
        poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
        average_rating: 9.0,
        rating_count: 2600000,
        genres: ['Action', 'Thriller']
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        release_date: '1994-10-14',
        runtime: 154,
        poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        average_rating: 8.9,
        rating_count: 2000000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        release_date: '1994-07-06',
        runtime: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uUaHDa.jpg',
        average_rating: 8.8,
        rating_count: 2100000,
        genres: ['Drama', 'Romance']
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        release_date: '2010-07-16',
        runtime: 148,
        poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        average_rating: 8.8,
        rating_count: 2300000,
        genres: ['Sci-Fi', 'Thriller', 'Action']
      },
      {
        title: 'The Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        release_date: '1999-03-31',
        runtime: 136,
        poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
        average_rating: 8.7,
        rating_count: 1900000,
        genres: ['Sci-Fi', 'Action']
      },
      {
        title: 'Fight Club',
        description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
        release_date: '1999-10-15',
        runtime: 139,
        poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
        average_rating: 8.8,
        rating_count: 2000000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'The Lord of the Rings: The Return of the King',
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        release_date: '2003-12-17',
        runtime: 201,
        poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg',
        average_rating: 9.0,
        rating_count: 1800000,
        genres: ['Adventure', 'Drama', 'Action']
      },
      {
        title: 'The Pianist',
        description: 'A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.',
        release_date: '2002-09-25',
        runtime: 150,
        poster_url: 'https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/ctjEj2xM32OvBXCq8zAdK3ZrsAj.jpg',
        average_rating: 8.5,
        rating_count: 800000,
        genres: ['Drama']
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

    console.log('\n✅ Successfully added 10 more Hollywood movies!');
    console.log('📊 Total movies now: 30');
    
  } catch (error) {
    console.error('❌ Error adding movies:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

add10MoreMovies();
