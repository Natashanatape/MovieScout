const db = require('./src/config/database');

const add10MoreMovies = async () => {
  try {
    const movies = [
      {
        title: 'The Silence of the Lambs',
        description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer.',
        release_date: '1991-02-14',
        runtime: 118,
        poster_url: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg',
        average_rating: 8.6,
        rating_count: 1300000,
        genres: ['Thriller', 'Horror']
      },
      {
        title: 'Casablanca',
        description: 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
        release_date: '1942-11-26',
        runtime: 102,
        poster_url: 'https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hZbaSxH9X4FQXfUXGPbZ8fWQZVf.jpg',
        average_rating: 8.5,
        rating_count: 600000,
        genres: ['Drama', 'Romance']
      },
      {
        title: 'The Godfather Part II',
        description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
        release_date: '1974-12-20',
        runtime: 202,
        poster_url: 'https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/gLbBRyS7MBrmVUNce91Hmx9vzqI.jpg',
        average_rating: 9.0,
        rating_count: 1200000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: '12 Angry Men',
        description: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
        release_date: '1957-04-10',
        runtime: 96,
        poster_url: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/qqHQsStV6exghCM7zbObuYBiYxw.jpg',
        average_rating: 9.0,
        rating_count: 800000,
        genres: ['Drama']
      },
      {
        title: 'Spirited Away',
        description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
        release_date: '2001-07-20',
        runtime: 125,
        poster_url: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg',
        average_rating: 8.6,
        rating_count: 700000,
        genres: ['Adventure', 'Drama']
      },
      {
        title: 'The Green Mile',
        description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
        release_date: '1999-12-10',
        runtime: 189,
        poster_url: 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg',
        average_rating: 8.6,
        rating_count: 1100000,
        genres: ['Drama']
      },
      {
        title: 'City of God',
        description: 'In the slums of Rio, two kids\' paths diverge as one struggles to become a photographer and the other a kingpin.',
        release_date: '2002-08-30',
        runtime: 130,
        poster_url: 'https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2gedgd.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/h8gHn0OzB9vYdJBiNhBK2KgD3x2.jpg',
        average_rating: 8.6,
        rating_count: 750000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'Life Is Beautiful',
        description: 'When an open-minded Jewish waiter and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son.',
        release_date: '1997-12-20',
        runtime: 116,
        poster_url: 'https://image.tmdb.org/t/p/w500/74hLDKjD5aGYOotO6esUVaeISa2.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/bORe0eI72D874TMawAgpC6IlTup.jpg',
        average_rating: 8.6,
        rating_count: 700000,
        genres: ['Drama', 'Romance']
      },
      {
        title: 'The Prestige',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.',
        release_date: '2006-10-20',
        runtime: 130,
        poster_url: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg',
        average_rating: 8.5,
        rating_count: 1100000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'Apocalypse Now',
        description: 'A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel.',
        release_date: '1979-08-15',
        runtime: 147,
        poster_url: 'https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/cWyhbRC51JL77bo6yKfDfjDdlHt.jpg',
        average_rating: 8.4,
        rating_count: 650000,
        genres: ['Drama', 'Action']
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
