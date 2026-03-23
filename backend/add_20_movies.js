const db = require('./src/config/database');

const add20Movies = async () => {
  try {
    const movies = [
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        release_date: '2014-11-07',
        runtime: 169,
        poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
        average_rating: 8.6,
        rating_count: 1500000,
        genres: ['Sci-Fi', 'Drama', 'Adventure']
      },
      {
        title: 'Gladiator',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
        release_date: '2000-05-05',
        runtime: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
        average_rating: 8.5,
        rating_count: 1400000,
        genres: ['Action', 'Drama', 'Adventure']
      },
      {
        title: 'The Silence of the Lambs',
        description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
        release_date: '1991-02-14',
        runtime: 118,
        poster_url: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg',
        average_rating: 8.6,
        rating_count: 1300000,
        genres: ['Thriller', 'Horror']
      },
      {
        title: 'Saving Private Ryan',
        description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
        release_date: '1998-07-24',
        runtime: 169,
        poster_url: 'https://image.tmdb.org/t/p/w500/uqx37vjt6TLfrgEZeZTNHVUuMpj.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hdboC7VfXMB3F6zP5vdlVkEMdL.jpg',
        average_rating: 8.6,
        rating_count: 1200000,
        genres: ['Drama', 'Action']
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
        title: 'Parasite',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        release_date: '2019-05-30',
        runtime: 132,
        poster_url: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
        average_rating: 8.5,
        rating_count: 900000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
        release_date: '2019-04-26',
        runtime: 181,
        poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
        average_rating: 8.4,
        rating_count: 2000000,
        genres: ['Action', 'Sci-Fi', 'Adventure']
      },
      {
        title: 'Joker',
        description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.',
        release_date: '2019-10-04',
        runtime: 122,
        poster_url: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
        average_rating: 8.4,
        rating_count: 1600000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'The Lion King',
        description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
        release_date: '1994-06-24',
        runtime: 88,
        poster_url: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/1LRLLWGvs5sZdTzuMqLEahb88Pc.jpg',
        average_rating: 8.5,
        rating_count: 1400000,
        genres: ['Adventure', 'Drama']
      },
      {
        title: 'Titanic',
        description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        release_date: '1997-12-19',
        runtime: 194,
        poster_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        average_rating: 7.9,
        rating_count: 2100000,
        genres: ['Romance', 'Drama']
      },
      {
        title: 'The Departed',
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
        release_date: '2006-10-06',
        runtime: 151,
        poster_url: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/8Od5zV93Av7JPQYcCbRk73piLMJ.jpg',
        average_rating: 8.5,
        rating_count: 1200000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Whiplash',
        description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
        release_date: '2014-10-10',
        runtime: 106,
        poster_url: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg',
        average_rating: 8.5,
        rating_count: 900000,
        genres: ['Drama']
      },
      {
        title: 'The Prestige',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
        release_date: '2006-10-20',
        runtime: 130,
        poster_url: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg',
        average_rating: 8.5,
        rating_count: 1100000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'The Shining',
        description: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.',
        release_date: '1980-05-23',
        runtime: 146,
        poster_url: 'https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/3GJrXpUAzFAZNDHhkdVv0gjfzR.jpg',
        average_rating: 8.4,
        rating_count: 950000,
        genres: ['Horror', 'Thriller']
      },
      {
        title: 'Goodfellas',
        description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
        release_date: '1990-09-19',
        runtime: 146,
        poster_url: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hAPeXBdGDGmXRPj4OZZ0poH65Iu.jpg',
        average_rating: 8.7,
        rating_count: 1100000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: 'Schindler\'s List',
        description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
        release_date: '1993-12-15',
        runtime: 195,
        poster_url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg',
        average_rating: 9.0,
        rating_count: 1300000,
        genres: ['Drama']
      },
      {
        title: 'The Avengers',
        description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
        release_date: '2012-05-04',
        runtime: 143,
        poster_url: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg',
        average_rating: 8.0,
        rating_count: 2500000,
        genres: ['Action', 'Sci-Fi', 'Adventure']
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
        release_date: '2021-12-17',
        runtime: 148,
        poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg',
        average_rating: 8.2,
        rating_count: 1800000,
        genres: ['Action', 'Sci-Fi', 'Adventure']
      },
      {
        title: 'Dune',
        description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
        release_date: '2021-10-22',
        runtime: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/s1FhAJKtbw3cH8i2M5fJJn6eVxV.jpg',
        average_rating: 8.0,
        rating_count: 900000,
        genres: ['Sci-Fi', 'Adventure', 'Drama']
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        release_date: '2023-07-21',
        runtime: 180,
        poster_url: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
        average_rating: 8.3,
        rating_count: 700000,
        genres: ['Drama', 'Thriller']
      },
      {
        title: '3 Idiots',
        description: 'Two friends embark on a quest for a lost buddy. On this journey, they encounter a long-forgotten bet, a wedding they must crash, and a funeral that goes impossibly out of control.',
        release_date: '2009-12-25',
        runtime: 170,
        poster_url: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8IC0.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/6oaL4DP75yABrd5EbC4H2zq5ghc.jpg',
        average_rating: 8.4,
        rating_count: 500000,
        genres: ['Drama', 'Comedy']
      },
      {
        title: 'Dangal',
        description: 'Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become world-class wrestlers.',
        release_date: '2016-12-23',
        runtime: 161,
        poster_url: 'https://image.tmdb.org/t/p/w500/lNyLSOKMMeUPr1RsL4KcRuIXwHt.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/7GsM4mtM0worCtIVeiQt28HieeN.jpg',
        average_rating: 8.3,
        rating_count: 400000,
        genres: ['Drama', 'Action']
      },
      {
        title: 'PK',
        description: 'An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.',
        release_date: '2014-12-19',
        runtime: 153,
        poster_url: 'https://image.tmdb.org/t/p/w500/fZWiYThB4Hf3XNJvpHfqY0RYlwl.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/2VKnNXbHPZnKqMDqZvLu3xqjU6F.jpg',
        average_rating: 8.1,
        rating_count: 350000,
        genres: ['Drama', 'Comedy', 'Sci-Fi']
      },
      {
        title: 'Lagaan',
        description: 'The people of a small village in Victorian India stake their future on a game of cricket against their ruthless British rulers.',
        release_date: '2001-06-15',
        runtime: 224,
        poster_url: 'https://image.tmdb.org/t/p/w500/fUWada6iNIVbqNZIhXKPqYdFhzl.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/3WdZjXk8H7xhvXvVXYJqoJJzKPg.jpg',
        average_rating: 8.1,
        rating_count: 300000,
        genres: ['Drama', 'Adventure']
      },
      {
        title: 'Taare Zameen Par',
        description: 'An eight-year-old boy is thought to be lazy and a trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school.',
        release_date: '2007-12-21',
        runtime: 165,
        poster_url: 'https://image.tmdb.org/t/p/w500/gANHJeZPN8Iu0C5qvZNHqLmVKHe.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/4mScPTqXLYKdSvjLxhLHZqKqvdL.jpg',
        average_rating: 8.4,
        rating_count: 280000,
        genres: ['Drama']
      },
      {
        title: 'Drishyam',
        description: 'A man goes to extreme lengths to save his family from punishment after the family commits an accidental crime.',
        release_date: '2015-07-31',
        runtime: 163,
        poster_url: 'https://image.tmdb.org/t/p/w500/2cJJYF1TvhXPjqRYfPvPJqQRqLu.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/5Ht9LqKPFxvmqvqKqPqKqKqKqKq.jpg',
        average_rating: 8.2,
        rating_count: 250000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Zindagi Na Milegi Dobara',
        description: 'Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged.',
        release_date: '2011-07-15',
        runtime: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/8LqXqNDiAdPKKmBXOG6B87dCqCN.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/2VKnNXbHPZnKqMDqZvLu3xqjU6F.jpg',
        average_rating: 8.1,
        rating_count: 220000,
        genres: ['Drama', 'Comedy', 'Adventure']
      },
      {
        title: 'Bajrangi Bhaijaan',
        description: 'An Indian man with a magnanimous heart takes a young mute Pakistani girl back to her homeland to reunite her with her family.',
        release_date: '2015-07-17',
        runtime: 163,
        poster_url: 'https://image.tmdb.org/t/p/w500/2cJJYF1TvhXPjqRYfPvPJqQRqLu.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/5Ht9LqKPFxvmqvqKqPqKqKqKqKq.jpg',
        average_rating: 8.0,
        rating_count: 200000,
        genres: ['Drama', 'Comedy', 'Adventure']
      },
      {
        title: 'Andhadhun',
        description: 'A series of mysterious events change the life of a blind pianist who now must report a crime that was actually never witnessed by him.',
        release_date: '2018-10-05',
        runtime: 139,
        poster_url: 'https://image.tmdb.org/t/p/w500/6oaL4DP75yABrd5EbC4H2zq5ghc.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/3WdZjXk8H7xhvXvVXYJqoJJzKPg.jpg',
        average_rating: 8.3,
        rating_count: 180000,
        genres: ['Thriller', 'Drama']
      },
      {
        title: 'Gully Boy',
        description: 'A coming-of-age story based on the lives of street rappers in Mumbai.',
        release_date: '2019-02-14',
        runtime: 154,
        poster_url: 'https://image.tmdb.org/t/p/w500/5Ht9LqKPFxvmqvqKqPqKqKqKqKq.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/2VKnNXbHPZnKqMDqZvLu3xqjU6F.jpg',
        average_rating: 7.9,
        rating_count: 150000,
        genres: ['Drama']
      }
    ];

    console.log('🎬 Adding 30 movies (20 Hollywood + 10 Bollywood)...\n');

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

    console.log('\n✅ Successfully added 30 movies!');
    
  } catch (error) {
    console.error('❌ Error adding movies:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

add20Movies();
