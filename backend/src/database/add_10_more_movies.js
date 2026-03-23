const db = require('../config/database');

const add10MoreMovies = async () => {
  try {
    const movies = [
      { title: 'Avengers: Endgame', description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe. The surviving Avengers and their allies must develop a plan to bring back their vanquished allies for an epic showdown with Thanos, the evil demigod who decimated the planet and the universe. This culmination of 22 interconnected films brings together the biggest ensemble cast in cinema history for an emotional and action-packed finale that redefines the superhero genre.', release_date: '2019-04-26', runtime: 181, poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', average_rating: 8.4, rating_count: 2000000 },
      { title: 'Spider-Man: Into the Spider-Verse', description: 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities. When a super collider accident brings together heroes from different dimensions, Miles must master his newfound powers and work with the other Spider-People to save all of reality. This groundbreaking animated film features a unique visual style that brings comic book art to life, combining computer animation with traditional hand-drawn comic book techniques to create a stunning and innovative cinematic experience.', release_date: '2018-12-14', runtime: 117, poster_url: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/uUiId6cG32JSRI6RyBQSvQtLJJM.jpg', average_rating: 8.4, rating_count: 900000 },
      { title: 'Joker', description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime, eventually becoming the infamous Joker. This path brings him face-to-face with his alter-ego: the Joker. Set in 1981, the film follows Arthur\'s transformation from a struggling comedian caring for his ailing mother to becoming the Clown Prince of Crime. Joaquin Phoenix delivers a haunting and Oscar-winning performance in this dark character study that explores themes of mental illness, social inequality, and the thin line between sanity and madness.', release_date: '2019-10-04', runtime: 122, poster_url: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg', average_rating: 8.4, rating_count: 1100000 },
      { title: 'The Lion King', description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself. After the murder of his father, a young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery. Years later, he must decide whether to return and reclaim his rightful place as king. This Disney animated masterpiece features unforgettable music by Elton John and Tim Rice, stunning animation, and timeless themes of family, responsibility, and the circle of life that have made it one of the most beloved films of all time.', release_date: '1994-06-24', runtime: 88, poster_url: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/1LRLLWGvs5sZdTzuMqLEahb88Pc.jpg', average_rating: 8.5, rating_count: 1500000 },
      { title: 'Back to the Future', description: 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown. There, he meets his teenage parents and accidentally prevents their first meeting, threatening his own existence. Marty must repair the damage to history by rekindling his parents\' romance and finding a way back to 1985. This beloved sci-fi comedy adventure features perfect chemistry between Michael J. Fox and Christopher Lloyd, memorable music, and clever time-travel paradoxes that have made it a cultural phenomenon.', release_date: '1985-07-03', runtime: 116, poster_url: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/dMKzRfXXfVhUX3ROGSo3Q0yBr2r.jpg', average_rating: 8.3, rating_count: 1200000 },
      { title: 'The Shining', description: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future. Jack Torrance becomes the winter caretaker at the isolated Overlook Hotel in Colorado, hoping to cure his writer\'s block. He settles in along with his wife, Wendy, and his son, Danny, who is plagued by psychic premonitions. As Jack\'s writing goes nowhere and Danny\'s visions become more disturbing, Jack discovers the hotel\'s dark secrets and begins to unravel into a homicidal maniac. Stanley Kubrick\'s masterpiece of psychological horror features iconic imagery and performances that have terrified audiences for decades.', release_date: '1980-05-23', runtime: 146, poster_url: 'https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/3GJeNT321OqaKLfDQnhw0MQbmTH.jpg', average_rating: 8.4, rating_count: 1000000 },
      { title: 'Toy Story', description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy\'s room. Woody, a good-hearted cowboy doll who belongs to a young boy named Andy, sees his position as Andy\'s favorite toy jeopardized when his parents buy him a Buzz Lightyear action figure. Even worse, the arrogant Buzz thinks he\'s a real spaceman on a mission to return to his home planet. When Andy\'s family moves to a new house, Woody and Buzz must escape the clutches of maladjusted neighbor Sid Phillips and reunite with Andy. Pixar\'s groundbreaking first feature film revolutionized animation and created a beloved franchise with its perfect blend of humor, heart, and innovative computer animation.', release_date: '1995-11-22', runtime: 81, poster_url: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/8KomINZhIuJeB4oB7k7tkq8tmE.jpg', average_rating: 8.3, rating_count: 1400000 },
      { title: 'Coco', description: 'Despite his family\'s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz. Desperate to prove his talent, Miguel finds himself in the stunning and colorful Land of the Dead following a mysterious chain of events. Along the way, he meets charming trickster Hector, and together, they set off on an extraordinary journey to unlock the real story behind Miguel\'s family history. This Pixar masterpiece celebrates Mexican culture and the importance of family while exploring themes of memory, legacy, and following your dreams. With stunning visuals, memorable music, and an emotional story, Coco has touched hearts worldwide.', release_date: '2017-11-22', runtime: 105, poster_url: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg', average_rating: 8.4, rating_count: 1100000 },
      { title: 'Spirited Away', description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts. Chihiro and her parents stumble upon a seemingly abandoned amusement park. After her parents are turned into pigs by the witch Yubaba, Chihiro takes a job working in Yubaba\'s bathhouse to find a way to free herself and her parents and return to the human world. Hayao Miyazaki\'s masterpiece is a stunning and imaginative journey through a magical world filled with memorable characters and breathtaking animation. Winner of the Academy Award for Best Animated Feature, this Studio Ghibli classic explores themes of identity, greed, and environmentalism.', release_date: '2001-07-20', runtime: 125, poster_url: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg', average_rating: 8.6, rating_count: 1200000 },
      { title: 'Your Name', description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart? High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki\'s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other. Yet, somehow, it works. They build a connection by leaving notes, messages, and more importantly, an imprint. When they decide to finally meet, something goes wrong. This breathtaking anime film from Makoto Shinkai combines stunning animation, a touching romance, and elements of fantasy and time travel to create an unforgettable emotional experience.', release_date: '2016-08-26', runtime: 106, poster_url: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg', average_rating: 8.5, rating_count: 900000 },
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
        
        const movieGenres = {
          'Avengers: Endgame': ['Action', 'Adventure', 'Sci-Fi'],
          'Spider-Man: Into the Spider-Verse': ['Action', 'Adventure'],
          'Joker': ['Drama', 'Thriller'],
          'The Lion King': ['Adventure'],
          'Back to the Future': ['Adventure', 'Comedy', 'Sci-Fi'],
          'The Shining': ['Horror', 'Thriller'],
          'Toy Story': ['Adventure', 'Comedy'],
          'Coco': ['Adventure'],
          'Spirited Away': ['Adventure'],
          'Your Name': ['Romance', 'Drama']
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

    console.log('✅ 10 more movies added! Total: 30+ movies now');
  } catch (error) {
    console.error('❌ Error adding movies:', error);
    throw error;
  }
};

add10MoreMovies()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
