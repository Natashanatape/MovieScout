const db = require('../config/database');

const seedData = async () => {
  try {
    // Clear existing data
    await db.query('TRUNCATE TABLE movies, genres, movie_genres, ratings, reviews, watchlist RESTART IDENTITY CASCADE');
    console.log('✅ Database cleared');

    // Insert genres
    const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Adventure'];
    
    for (const genre of genres) {
      await db.query(
        'INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [genre]
      );
    }
    console.log('✅ Genres inserted');

    // Insert sample movies
    const movies = [
      {
        title: 'The Shawshank Redemption',
        description: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope. Over the course of his incarceration, Andy befriends Red and helps him find hope and meaning in life through acts of common decency.',
        release_date: '1994-09-23',
        runtime: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
        average_rating: 9.3,
        rating_count: 2500000
      },
      {
        title: 'The Godfather',
        description: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge. The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son, who must balance family loyalty with his own moral compass.',
        release_date: '1972-03-24',
        runtime: 175,
        poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
        average_rating: 9.2,
        rating_count: 1800000
      },
      {
        title: 'The Dark Knight',
        description: 'Batman raises the stakes in his war on crime in Gotham City. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker. When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        release_date: '2008-07-18',
        runtime: 152,
        poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
        average_rating: 9.0,
        rating_count: 2300000
      },
      {
        title: 'Pulp Fiction',
        description: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time. The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. Quentin Tarantino\'s masterpiece weaves together multiple storylines in a non-linear narrative that has become iconic in cinema history.',
        release_date: '1994-10-14',
        runtime: 154,
        poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        average_rating: 8.9,
        rating_count: 2000000
      },
      {
        title: 'Inception',
        description: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb\'s rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible: inception. A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        release_date: '2010-07-16',
        runtime: 148,
        poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        average_rating: 8.8,
        rating_count: 2200000
      },
      {
        title: 'Fight Club',
        description: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion. An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more. This cult classic explores themes of consumerism, masculinity, and identity in modern society.',
        release_date: '1999-10-15',
        runtime: 139,
        poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
        average_rating: 8.8,
        rating_count: 2000000
      },
      {
        title: 'Forrest Gump',
        description: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him. The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart. This heartwarming tale spans decades of American history through the eyes of an extraordinary ordinary man.',
        release_date: '1994-07-06',
        runtime: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uUaHDa.jpg',
        average_rating: 8.8,
        rating_count: 1900000
      },
      {
        title: 'The Matrix',
        description: 'Thomas Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. As a rebel against the machines, Morpheus awakens Neo to the real world, a ravaged wasteland where most of humanity have been captured by a race of machines that live off of the humans body heat and electrochemical energy and who imprison their minds within an artificial reality known as the Matrix.',
        release_date: '1999-03-31',
        runtime: 136,
        poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
        average_rating: 8.7,
        rating_count: 1800000
      },
      {
        title: 'The Hangover',
        description: 'When three friends finally come to after a raucous night of bachelor-party revelry, they find a baby in the closet and a tiger in the bathroom. But they can\'t seem to locate their best friend, Doug – who\'s supposed to be tying the knot. Launching a frantic search for Doug, the trio perseveres through a nasty hangover to try to make it to the church on time. This outrageous comedy follows three groomsmen who lose their about-to-be-wed buddy during their wild and memorable Vegas bachelor party.',
        release_date: '2009-06-05',
        runtime: 100,
        poster_url: 'https://image.tmdb.org/t/p/w500/uluhlXhjRbRs5cL7J3GSe1vTAH0.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/9N2sIAGP5MlJuNtJLEXwSq61mNW.jpg',
        average_rating: 7.3,
        rating_count: 1200000
      },
      {
        title: 'The Conjuring',
        description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Forced to confront a powerful entity, the Warrens find themselves caught in the most terrifying case of their lives. Based on a true story, this supernatural horror film follows the husband-and-wife team as they investigate a haunting that threatens to destroy a family. The case would go on to be known as one of the most disturbing hauntings in history.',
        release_date: '2013-07-19',
        runtime: 112,
        poster_url: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/2vRN9BxxbJYUlFFhJQwD8C0ZCbY.jpg',
        average_rating: 7.5,
        rating_count: 900000
      },
      {
        title: 'Indiana Jones and the Raiders of the Lost Ark',
        description: 'When Dr. Indiana Jones – the tweed-suited professor who just happens to be a celebrated archaeologist – is hired by the government to locate the legendary Ark of the Covenant, he finds himself up against the entire Nazi regime. This action-adventure classic follows Indy as he races against time and enemies across the globe. With his trademark fedora and bullwhip, Indiana Jones embarks on a thrilling quest filled with danger, ancient mysteries, and non-stop excitement in one of cinema\'s greatest adventure films.',
        release_date: '1981-06-12',
        runtime: 115,
        poster_url: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
        backdrop_url: 'https://image.tmdb.org/t/p/original/3WA0xfKRyJYGqHQyKDc3c7R4vIi.jpg',
        average_rating: 8.0,
        rating_count: 850000
      }
    ];

    for (const movie of movies) {
      const result = await db.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, backdrop_url, average_rating, rating_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [movie.title, movie.description, movie.release_date, movie.runtime, movie.poster_url, movie.backdrop_url, movie.average_rating, movie.rating_count]
      );
      
      if (result.rows.length > 0) {
        const movieId = result.rows[0].id;
        
        // Add genres to movies
        const movieGenres = {
          'The Shawshank Redemption': ['Drama'],
          'The Godfather': ['Drama', 'Thriller'],
          'The Dark Knight': ['Action', 'Thriller'],
          'Pulp Fiction': ['Drama', 'Thriller'],
          'Inception': ['Action', 'Sci-Fi', 'Thriller'],
          'Fight Club': ['Drama'],
          'Forrest Gump': ['Drama', 'Romance'],
          'The Matrix': ['Action', 'Sci-Fi'],
          'The Hangover': ['Comedy'],
          'The Conjuring': ['Horror'],
          'Indiana Jones and the Raiders of the Lost Ark': ['Adventure', 'Action']
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

    console.log('✅ Movies inserted successfully!');
    console.log('✅ Database seeded with sample data!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedData;
