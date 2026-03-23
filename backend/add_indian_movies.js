const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const indianMovies = [
  // Bollywood (Hindi)
  { title: 'Dangal', desc: 'Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers, breaking gender stereotypes.', date: '2016-12-23', runtime: 161, poster: 'https://image.tmdb.org/t/p/w500/lNkDYKmrVem4S9pRVbqbgzKpEXS.jpg', language: 'Hindi', views: 3500000 },
  { title: '3 Idiots', desc: 'Two friends embark on a quest to find their long-lost companion, recalling their college days and the lessons learned.', date: '2009-12-25', runtime: 170, poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8uO8.jpg', language: 'Hindi', views: 4200000 },
  { title: 'PK', desc: 'An alien on Earth loses his communication device and questions religious dogmas and superstitions.', date: '2014-12-19', runtime: 153, poster: 'https://image.tmdb.org/t/p/w500/9V1fXWGUYkI3YJUdAbJKw0VYdx5.jpg', language: 'Hindi', views: 3800000 },
  { title: 'Bajrangi Bhaijaan', desc: 'An Indian man with a magnanimous heart takes a young mute Pakistani girl back to her homeland.', date: '2015-07-17', runtime: 163, poster: 'https://image.tmdb.org/t/p/w500/4SyzsNkmPGEbM6ZHCRJjRbLZMRx.jpg', language: 'Hindi', views: 3200000 },
  { title: 'Sultan', desc: 'A wrestler from Haryana participates in a mixed martial arts championship to win back his love.', date: '2016-07-06', runtime: 170, poster: 'https://image.tmdb.org/t/p/w500/7CqIbXxbGzP5Dd7a5T8ZqVrDxqH.jpg', language: 'Hindi', views: 2800000 },
  { title: 'Padmaavat', desc: 'Set in medieval Rajasthan, Queen Padmavati is married to a noble king and they live in a prosperous fortress.', date: '2018-01-25', runtime: 164, poster: 'https://image.tmdb.org/t/p/w500/lRsQj03F7cWdMhzgembxsYhHb5P.jpg', language: 'Hindi', views: 2500000 },
  { title: 'War', desc: 'An Indian soldier is assigned to eliminate his former mentor who has gone rogue.', date: '2019-10-02', runtime: 156, poster: 'https://image.tmdb.org/t/p/w500/8bZ0TcYxVw8P23fCqz8RbJWNaXF.jpg', language: 'Hindi', views: 2900000 },
  { title: 'Pathaan', desc: 'An exiled RAW agent is brought back to lead a covert mission to stop a terrorist attack.', date: '2023-01-25', runtime: 146, poster: 'https://image.tmdb.org/t/p/w500/kIHgjAkuzvKBnmdstpBOo4AfZah.jpg', language: 'Hindi', views: 3100000 },
  
  // Tollywood (Telugu)
  { title: 'Baahubali: The Beginning', desc: 'A young man learns about his royal lineage and must reclaim his throne from his tyrannical uncle.', date: '2015-07-10', runtime: 159, poster: 'https://image.tmdb.org/t/p/w500/9HKVAhEJ4V3SVcc5Y3Y8yp7SSWX.jpg', language: 'Telugu', views: 4500000 },
  { title: 'Baahubali 2: The Conclusion', desc: 'Amarendra Baahubali fights for the freedom of his people and his kingdom.', date: '2017-04-28', runtime: 167, poster: 'https://image.tmdb.org/t/p/w500/v7dEjHO7GstemlWqmoidMw3l6Z8.jpg', language: 'Telugu', views: 5200000 },
  { title: 'RRR', desc: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country.', date: '2022-03-25', runtime: 187, poster: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg', language: 'Telugu', views: 4800000 },
  { title: 'Pushpa: The Rise', desc: 'A labourer rises through the ranks of a red sandalwood smuggling syndicate.', date: '2021-12-17', runtime: 179, poster: 'https://image.tmdb.org/t/p/w500/5MlbEfJmVrcvZg4qmthMFHDy9Nh.jpg', language: 'Telugu', views: 3900000 },
  { title: 'Ala Vaikunthapurramuloo', desc: 'A middle-class man discovers he was switched at birth with a millionaire\'s son.', date: '2020-01-12', runtime: 165, poster: 'https://image.tmdb.org/t/p/w500/6VJXlIa0FxnWdYjBfzodEe0F3hS.jpg', language: 'Telugu', views: 3200000 },
  
  // Tamil
  { title: 'Vikram', desc: 'Members of a black ops team must track and eliminate a gang of masked murderers.', date: '2022-06-03', runtime: 174, poster: 'https://image.tmdb.org/t/p/w500/2yFMivq0Y8SWJEQhp694LcMNgVn.jpg', language: 'Tamil', views: 3400000 },
  { title: 'Ponniyin Selvan: Part 1', desc: 'Vandiyathevan sets out to cross the Chola land to deliver a message from the Crown Prince.', date: '2022-09-30', runtime: 167, poster: 'https://image.tmdb.org/t/p/w500/qvkryf2yCoPEfnXcH8kGzWCNvHJ.jpg', language: 'Tamil', views: 3100000 },
  { title: 'Master', desc: 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster.', date: '2021-01-13', runtime: 179, poster: 'https://image.tmdb.org/t/p/w500/cJj8xRWs1VJbkXqmIbQmvdMqBqC.jpg', language: 'Tamil', views: 2800000 },
  { title: 'Sarkar', desc: 'An NRI businessman learns his vote has been cast by someone else and decides to investigate.', date: '2018-11-06', runtime: 166, poster: 'https://image.tmdb.org/t/p/w500/8Ys0RbRJp8OMhVvjqKdZ8ywqQqN.jpg', language: 'Tamil', views: 2500000 },
  
  // Kannada
  { title: 'KGF Chapter 1', desc: 'In the 1970s, a gangster rises to power in the Kolar Gold Fields.', date: '2018-12-21', runtime: 156, poster: 'https://image.tmdb.org/t/p/w500/sGO5zBcSCOX1LLxm8fYP2gVFLXR.jpg', language: 'Kannada', views: 3600000 },
  { title: 'KGF Chapter 2', desc: 'Rocky continues his rise to power while facing new enemies and challenges.', date: '2022-04-14', runtime: 168, poster: 'https://image.tmdb.org/t/p/w500/xYduGBM4v5Rv1P0ZGcZMyqzqzEH.jpg', language: 'Kannada', views: 4200000 },
  { title: 'Kantara', desc: 'A tribal warrior faces off against a forest officer in a battle for land rights.', date: '2022-09-30', runtime: 148, poster: 'https://image.tmdb.org/t/p/w500/8FNzXpYGlcWz4KdAXIzKJxvXhsz.jpg', language: 'Kannada', views: 3300000 },
  
  // Malayalam
  { title: 'Drishyam', desc: 'A man goes to extreme lengths to protect his family from the dark consequences of their actions.', date: '2013-12-19', runtime: 160, poster: 'https://image.tmdb.org/t/p/w500/8yYif8bPJVLLhXq0bVbVp0Qx1Ks.jpg', language: 'Malayalam', views: 2900000 },
  { title: 'Lucifer', desc: 'A political leader\'s death leads to a power struggle in Kerala politics.', date: '2019-03-28', runtime: 174, poster: 'https://image.tmdb.org/t/p/w500/3kHPkHKw3gvKPdZQqxJYqJqKYqN.jpg', language: 'Malayalam', views: 2600000 },
  { title: 'Manjummel Boys', desc: 'A group of friends from Manjummel go on a trip that turns into a rescue mission.', date: '2024-02-22', runtime: 135, poster: 'https://picsum.photos/seed/manjummel/300/450', language: 'Malayalam', views: 2200000 },
  
  // Marathi
  { title: 'Sairat', desc: 'A young couple from different castes fall in love and elope, facing societal backlash.', date: '2016-04-29', runtime: 174, poster: 'https://picsum.photos/seed/sairat/300/450', language: 'Marathi', views: 1800000 },
  { title: 'Natsamrat', desc: 'A veteran actor struggles with his family and identity after retirement.', date: '2016-01-01', runtime: 165, poster: 'https://picsum.photos/seed/natsamrat/300/450', language: 'Marathi', views: 1500000 },
  
  // Punjabi
  { title: 'Chhalla Mud Ke Nahi Aaya', desc: 'A young man from Punjab dreams of going abroad but faces unexpected challenges.', date: '2022-07-29', runtime: 125, poster: 'https://picsum.photos/seed/chhalla/300/450', language: 'Punjabi', views: 1200000 },
  { title: 'Qismat', desc: 'A romantic drama about love, destiny, and heartbreak.', date: '2018-09-21', runtime: 142, poster: 'https://picsum.photos/seed/qismat/300/450', language: 'Punjabi', views: 1400000 }
];

async function addIndianMovies() {
  const client = await pool.connect();
  
  try {
    console.log('========================================');
    console.log('   ADDING INDIAN MOVIES');
    console.log('========================================\n');
    
    // Step 1: Add language column
    console.log('Step 1: Adding language column...');
    await client.query(`
      ALTER TABLE movies 
      ADD COLUMN IF NOT EXISTS language VARCHAR(50);
    `);
    console.log('✅ Language column added!\n');
    
    // Step 2: Add Indian movies
    console.log('Step 2: Adding Indian movies...\n');
    
    for (const movie of indianMovies) {
      await client.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, type, language, rating_count)
         VALUES ($1, $2, $3, $4, $5, 'movie', $6, $7)`,
        [movie.title, movie.desc, movie.date, movie.runtime, movie.poster, movie.language, movie.views]
      );
      console.log(`  ✅ ${movie.title} (${movie.language})`);
    }
    
    console.log('\n========================================');
    console.log('   ✅ COMPLETE!');
    console.log('========================================\n');
    console.log('📊 Added:');
    console.log('   - 8 Hindi (Bollywood)');
    console.log('   - 5 Telugu (Tollywood)');
    console.log('   - 4 Tamil');
    console.log('   - 3 Kannada');
    console.log('   - 3 Malayalam');
    console.log('   - 2 Marathi');
    console.log('   - 2 Punjabi');
    console.log('\n   Total: 27 Indian Movies\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addIndianMovies();
