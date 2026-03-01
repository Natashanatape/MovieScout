const db = require('../config/database');

const addMoreMovies = async () => {
  try {
    const movies = [
      { title: 'The Lord of the Rings: The Return of the King', description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', release_date: '2003-12-17', runtime: 201, poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg', average_rating: 8.9, rating_count: 2100000 },
      { title: 'Schindler\'s List', description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', release_date: '1993-12-15', runtime: 195, poster_url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg', average_rating: 8.9, rating_count: 1300000 },
      { title: 'The Lord of the Rings: The Fellowship of the Ring', description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.', release_date: '2001-12-19', runtime: 178, poster_url: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/x2RS3uTcsJJ9IfjNPcgDmukoEcQ.jpg', average_rating: 8.8, rating_count: 2200000 },
      { title: 'Star Wars: Episode V - The Empire Strikes Back', description: 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy.', release_date: '1980-05-21', runtime: 124, poster_url: 'https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/qyFNnMHdnPJJg0PpQnmeXnVMjXq.jpg', average_rating: 8.7, rating_count: 1200000 },
      { title: 'Goodfellas', description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.', release_date: '1990-09-19', runtime: 145, poster_url: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/hAPeXBdGDGmXRPj4OZZ0poH65Iu.jpg', average_rating: 8.7, rating_count: 1100000 },
      { title: 'Parasite', description: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.', release_date: '2019-05-30', runtime: 132, poster_url: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg', average_rating: 8.5, rating_count: 800000 },
      { title: 'The Green Mile', description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.', release_date: '1999-12-10', runtime: 189, poster_url: 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg', average_rating: 8.6, rating_count: 1200000 },
      { title: 'The Silence of the Lambs', description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', release_date: '1991-02-14', runtime: 118, poster_url: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', average_rating: 8.6, rating_count: 1300000 },
      { title: 'Saving Private Ryan', description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.', release_date: '1998-07-24', runtime: 169, poster_url: 'https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/hjQp148VjWF2L9S5BYRmI8QHoQ.jpg', average_rating: 8.6, rating_count: 1200000 },
      { title: 'The Departed', description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.', release_date: '2006-10-06', runtime: 151, poster_url: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/8Od5zV93b2wnKGFWP3TJF6VzKbQ.jpg', average_rating: 8.5, rating_count: 1100000 },
      { title: 'Gladiator', description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', release_date: '2000-05-05', runtime: 155, poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/xEKGUCXBJXhpJcPrwXRbPTLkYTc.jpg', average_rating: 8.5, rating_count: 1400000 },
      { title: 'The Prestige', description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.', release_date: '2006-10-20', runtime: 130, poster_url: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/85pNJw6MX0FmhZIqGFnOYdKPBZV.jpg', average_rating: 8.5, rating_count: 1200000 },
      { title: 'Whiplash', description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.', release_date: '2014-10-10', runtime: 106, poster_url: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg', average_rating: 8.5, rating_count: 800000 },
      { title: 'The Intouchables', description: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.', release_date: '2011-11-02', runtime: 112, poster_url: 'https://image.tmdb.org/t/p/w500/323BP0itpxTsO0skTwdnVmf7YC7.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/ihWaJZCUIon2dXcosjQG2JHJAPN.jpg', average_rating: 8.5, rating_count: 800000 },
      { title: 'The Pianist', description: 'A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.', release_date: '2002-09-25', runtime: 150, poster_url: 'https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/ctjEj2xM32OvBXCq8zAdK3ZrsAj.jpg', average_rating: 8.5, rating_count: 700000 },
    ];

    for (const movie of movies) {
      const result = await db.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, backdrop_url, average_rating, rating_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [movie.title, movie.description, movie.release_date, movie.runtime, movie.poster_url, movie.backdrop_url, movie.average_rating, movie.rating_count]
      );
      
      if (result.rows.length > 0) {
        const movieId = result.rows[0].id;
        
        // Add genres
        const movieGenres = {
          'The Lord of the Rings: The Return of the King': ['Adventure', 'Action'],
          'Schindler\'s List': ['Drama'],
          'The Lord of the Rings: The Fellowship of the Ring': ['Adventure', 'Action'],
          'Star Wars: Episode V - The Empire Strikes Back': ['Adventure', 'Action', 'Sci-Fi'],
          'Goodfellas': ['Drama', 'Thriller'],
          'Parasite': ['Drama', 'Thriller'],
          'The Green Mile': ['Drama'],
          'The Silence of the Lambs': ['Thriller', 'Horror'],
          'Saving Private Ryan': ['Drama', 'Action'],
          'The Departed': ['Drama', 'Thriller'],
          'Gladiator': ['Action', 'Drama'],
          'The Prestige': ['Drama', 'Thriller'],
          'Whiplash': ['Drama'],
          'The Intouchables': ['Drama', 'Comedy'],
          'The Pianist': ['Drama']
        };

        const genresForMovie = movieGenres[movie.title] || [];
        for (const genreName of genresForMovie) {
          const genreResult = await db.query('SELECT id FROM genres WHERE name = $1', [genreName]);
          if (genreResult.rows.length > 0) {
            await db.query(
              'INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [movieId, genreResult.rows[0].id]
            );
          }
        }
      }
    }

    console.log('✅ 15 more movies added successfully! Total: 20+ movies');
  } catch (error) {
    console.error('❌ Error adding movies:', error);
    throw error;
  }
};

addMoreMovies()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
