const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function resetMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Deleting all movies...\n');
    await client.query('DELETE FROM movies');
    console.log('✅ All movies deleted\n');
    
    console.log('📝 Adding fresh movies with unique posters...\n');
    
    const movies = [
      { title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', release_date: '1994-09-23', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', average_rating: 9.3, rating_count: 2500000 },
      { title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', release_date: '1972-03-24', runtime: 175, poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', average_rating: 9.2, rating_count: 1800000 },
      { title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.', release_date: '2008-07-18', runtime: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 9.0, rating_count: 2600000 },
      { title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', release_date: '1994-10-14', runtime: 154, poster_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', average_rating: 8.9, rating_count: 2000000 },
      { title: 'Forrest Gump', description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.', release_date: '1994-07-06', runtime: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', average_rating: 8.8, rating_count: 2100000 },
      { title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', release_date: '2010-07-16', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 8.8, rating_count: 2300000 },
      { title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', release_date: '1999-03-31', runtime: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', average_rating: 8.7, rating_count: 1900000 },
      { title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', release_date: '2014-11-07', runtime: 169, poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', average_rating: 8.6, rating_count: 1700000 },
      { title: 'Avengers: Endgame', description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions.', release_date: '2019-04-26', runtime: 181, poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', average_rating: 8.4, rating_count: 2800000 },
      { title: 'Spider-Man: No Way Home', description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.', release_date: '2021-12-17', runtime: 148, poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', average_rating: 8.2, rating_count: 1500000 },
      { title: 'Top Gun: Maverick', description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', release_date: '2022-05-27', runtime: 130, poster_url: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', average_rating: 8.3, rating_count: 1200000 },
      { title: 'Dune', description: 'Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.', release_date: '2021-10-22', runtime: 155, poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', average_rating: 8.0, rating_count: 1100000 },
      { title: 'Titanic', description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.', release_date: '1997-12-19', runtime: 194, poster_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', average_rating: 7.9, rating_count: 1000000 },
      { title: 'Avatar', description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.', release_date: '2009-12-18', runtime: 162, poster_url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', average_rating: 7.8, rating_count: 1300000 },
      { title: 'The Lion King', description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.', release_date: '1994-06-24', runtime: 88, poster_url: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', average_rating: 8.5, rating_count: 900000 },
      { title: 'Jurassic Park', description: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids.', release_date: '1993-06-11', runtime: 127, poster_url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', average_rating: 8.1, rating_count: 850000 },
      { title: 'Gladiator', description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.', release_date: '2000-05-05', runtime: 155, poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', average_rating: 8.5, rating_count: 1400000 },
      { title: 'The Prestige', description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.', release_date: '2006-10-20', runtime: 130, poster_url: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg', average_rating: 8.5, rating_count: 1200000 },
      { title: 'The Departed', description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.', release_date: '2006-10-06', runtime: 151, poster_url: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg', average_rating: 8.5, rating_count: 1100000 },
      { title: 'Whiplash', description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.', release_date: '2014-10-10', runtime: 106, poster_url: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg', average_rating: 8.5, rating_count: 800000 },
      { title: '3 Idiots', description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.', release_date: '2009-12-25', runtime: 170, poster_url: 'http://localhost:5001/images/3iditios.jpg', average_rating: 8.4, rating_count: 425000 },
      { title: 'Dangal', description: 'Former wrestler Mahavir Singh Phogat trains his daughters Geeta Phogat and Babita Kumari to become India\'s first world-class female wrestlers.', release_date: '2016-12-23', runtime: 161, poster_url: 'https://image.tmdb.org/t/p/w500/lWcAVj5GhOKjNJ9bKhz5NApkSVl.jpg', average_rating: 8.3, rating_count: 195000 },
      { title: 'Bajrangi Bhaijaan', description: 'An Indian man with a magnanimous heart takes a young mute Pakistani girl back to her homeland to reunite her with her family.', release_date: '2015-07-17', runtime: 163, poster_url: 'http://localhost:5001/images/BajrangiBhaijaan.jpg', average_rating: 8.1, rating_count: 98000 },
      { title: 'Andhadhun', description: 'A series of mysterious events change the life of a blind pianist who now must report a crime that was actually never witnessed by him.', release_date: '2018-10-05', runtime: 139, poster_url: 'http://localhost:5001/images/Andhadhun.jpg', average_rating: 8.2, rating_count: 89000 },
      { title: 'Zindagi Na Milegi Dobara', description: 'Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged.', release_date: '2011-07-15', runtime: 155, poster_url: 'http://localhost:5001/images/zindaginamilegidubara.jpg', average_rating: 8.2, rating_count: 87000 },
      { title: 'Gully Boy', description: 'A coming-of-age story based on the lives of street rappers in Mumbai.', release_date: '2019-02-14', runtime: 154, poster_url: 'http://localhost:5001/images/gullyboy.jpg', average_rating: 7.9, rating_count: 45000 },
      { title: 'Drishyam', description: 'Desperate measures are taken by a man who tries to save his family from the dark side of the law, after they commit an unexpected crime.', release_date: '2015-07-31', runtime: 163, poster_url: 'http://localhost:5001/images/Drishyam.jpg', average_rating: 8.2, rating_count: 78000 },
      { title: 'Lagaan', description: 'The people of a small village in Victorian India stake their future on a game of cricket against their ruthless British rulers.', release_date: '2001-06-15', runtime: 224, poster_url: 'https://image.tmdb.org/t/p/w500/w3NkN8rNGCJLNs1V4Y8FJNcgLqB.jpg', average_rating: 8.1, rating_count: 112000 },
      { title: "Schindler's List", description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', release_date: '1993-12-15', runtime: 195, poster_url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', average_rating: 9.0, rating_count: 1350000 },
      { title: 'Taare Zameen Par', description: 'An eight-year-old boy is thought to be lazy and a trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school.', release_date: '2007-12-21', runtime: 165, poster_url: 'https://image.tmdb.org/t/p/w500/lhKGLTnNTKl4VHUeNNKZbcBXUKm.jpg', average_rating: 8.4, rating_count: 185000 },
      { title: 'PK', description: 'An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.', release_date: '2014-12-19', runtime: 153, poster_url: 'https://image.tmdb.org/t/p/w500/jMaJr0NLiH4hKULIY2xwYyBIp8X.jpg', average_rating: 8.1, rating_count: 175000 },
      { title: 'Fight Club', description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', release_date: '1999-10-15', runtime: 139, poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', average_rating: 8.8, rating_count: 2100000 },
      { title: 'The Lord of the Rings: The Return of the King', description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', release_date: '2003-12-17', runtime: 201, poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', average_rating: 9.0, rating_count: 1800000 },
      { title: 'Goodfellas', description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.', release_date: '1990-09-19', runtime: 145, poster_url: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', average_rating: 8.7, rating_count: 1200000 },
      { title: 'The Silence of the Lambs', description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', release_date: '1991-02-14', runtime: 118, poster_url: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', average_rating: 8.6, rating_count: 1400000 },
      { title: 'Saving Private Ryan', description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.', release_date: '1998-07-24', runtime: 169, poster_url: 'https://image.tmdb.org/t/p/w500/uqx37WOG0IFJbRyS7pYdVe7Uy5.jpg', average_rating: 8.6, rating_count: 1300000 },
      { title: 'The Green Mile', description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.', release_date: '1999-12-10', runtime: 189, poster_url: 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg', average_rating: 8.6, rating_count: 1300000 },
      { title: 'Parasite', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', release_date: '2019-05-30', runtime: 132, poster_url: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', average_rating: 8.5, rating_count: 850000 },
      { title: 'The Pianist', description: 'A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.', release_date: '2002-09-25', runtime: 150, poster_url: 'https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg', average_rating: 8.5, rating_count: 850000 },
      { title: 'Joker', description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.', release_date: '2019-10-04', runtime: 122, poster_url: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', average_rating: 8.4, rating_count: 1200000 },
      { title: 'The Usual Suspects', description: 'A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.', release_date: '1995-08-16', runtime: 106, poster_url: 'https://image.tmdb.org/t/p/w500/9Xw0I5RV2ZqNLpul6lMcsWSWTko.jpg', average_rating: 8.5, rating_count: 1100000 }
    ];

    for (const movie of movies) {
      const result = await client.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, average_rating, rating_count, type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'movie', NOW(), NOW())
         RETURNING id`,
        [movie.title, movie.description, movie.release_date, movie.runtime, movie.poster_url, movie.average_rating, movie.rating_count]
      );
      console.log(`✅ ${result.rows[0].id}. ${movie.title}`);
    }

    console.log(`\n✨ Done! Added ${movies.length} movies with unique posters`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

resetMovies();
