const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const movies = [
  // Hindi Movies (4 total - 3 already exist, adding 1 more)
  {
    title: 'Taare Zameen Par',
    description: 'An eight-year-old boy is thought to be lazy and a trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school. A touching story about dyslexia and the importance of understanding every child\'s unique abilities.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMDhjZWViN2MtNzgxOS00NmI4LThhMDYtMDJhZDZhZjQ3N2U5XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    release_date: '2007-12-21',
    runtime: 165,
    language: 'Hindi',
    type: 'movie',
    video_title: 'Taare Zameen Par - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=TrsV_ksjHUw'
  },
  
  // Telugu Movies (4 total - 1 exists, adding 3 more)
  {
    title: 'RRR',
    description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s. An epic action drama showcasing the friendship between two freedom fighters and their fight against British colonial rule.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
    release_date: '2022-03-25',
    runtime: 187,
    language: 'Telugu',
    type: 'movie',
    video_title: 'RRR - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=GY4CDmUeY2g'
  },
  {
    title: 'Baahubali 2: The Conclusion',
    description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom. The epic conclusion to the Baahubali saga reveals the truth behind Kattappa\'s betrayal.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYTJmZjU5ZTktNjQ5MC00NTI5LWE0ZDUtNzE4YjQ4ZjZhMGY0XkEyXkFqcGdeQXVyNjQ2MjQ5NzM@._V1_.jpg',
    release_date: '2017-04-28',
    runtime: 167,
    language: 'Telugu',
    type: 'movie',
    video_title: 'Baahubali 2 - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=G62HrubdD6o'
  },
  {
    title: 'Pushpa: The Rise',
    description: 'Violence erupts between red sandalwood smugglers and the police charged with bringing down their organization in the Seshachalam forests of South India. A gripping tale of a laborer who rises through the ranks of a red sandalwood smuggling syndicate.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYzljYjFkNzQtMGVmYS00Mjg4LWE4NjYtMzIxYjljMmMzZTZjXkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_.jpg',
    release_date: '2021-12-17',
    runtime: 179,
    language: 'Telugu',
    type: 'movie',
    video_title: 'Pushpa - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=pKctjlxbFDQ'
  },
  {
    title: 'Arjun Reddy',
    description: 'Arjun Reddy, a short-tempered house surgeon, gets used to drugs and drinks when his girlfriend is forced to marry another person. A raw and intense portrayal of a medical student\'s self-destructive path following a heartbreak.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYjhmMGRmZDItYjc2Ni00OGVlLTg4YTUtNzNlYmY1NjgwYWRkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg',
    release_date: '2017-08-25',
    runtime: 182,
    language: 'Telugu',
    type: 'movie',
    video_title: 'Arjun Reddy - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=j7xSvH7nRwg'
  },
  
  // Tamil Movies (4 new)
  {
    title: 'Vikram',
    description: 'Members of a black ops team must track and eliminate a gang of masked murderers. A high-octane action thriller featuring Kamal Haasan in a powerful role, with intense action sequences and a gripping storyline about revenge and justice.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYjFhOWY2ZjMtNjVmYi00NDI2LWE5YWYtMDVjOWFjMGU4MTg0XkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_.jpg',
    release_date: '2022-06-03',
    runtime: 174,
    language: 'Tamil',
    type: 'movie',
    video_title: 'Vikram - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=OKBMCL-frPU'
  },
  {
    title: 'Ponniyin Selvan: Part 1',
    description: 'Vandiyathevan crosses the Chola land to deliver a message from the Crown Prince Aditha Karikalan. Meanwhile, Kundavai attempts to establish political peace in a land seemingly beset with unrest. An epic historical drama based on the classic Tamil novel.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYjFjMTQzY2EtZjQ5MC00NGUyLWJiYWMtZDI3MTQ1MGU4OGY2XkEyXkFqcGdeQXVyNTgxODY5ODI@._V1_.jpg',
    release_date: '2022-09-30',
    runtime: 167,
    language: 'Tamil',
    type: 'movie',
    video_title: 'Ponniyin Selvan - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=KsH2LA8pCjo'
  },
  {
    title: 'Enthiran (Robot)',
    description: 'A scientist creates a robot that looks exactly like him. The robot is capable of understanding human emotions but runs amok when it falls in love with the scientist\'s girlfriend. A groundbreaking sci-fi film with spectacular visual effects.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTUzOTczNjQxOV5BMl5BanBnXkFtZTcwMjQ0MTczMw@@._V1_.jpg',
    release_date: '2010-10-01',
    runtime: 174,
    language: 'Tamil',
    type: 'movie',
    video_title: 'Enthiran - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=qSRIXyTiXDc'
  },
  {
    title: 'Jai Bhim',
    description: 'When a tribal man is arrested for a case of alleged theft, his wife turns to a human-rights lawyer to help bring justice. Based on a true story, this powerful courtroom drama highlights social justice and the fight against caste discrimination.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BY2Y5ZWMwZDgtZDQxYC00Mjk0LThhY2YtMmU1MTRmMjVhMjRiXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_.jpg',
    release_date: '2021-11-02',
    runtime: 164,
    language: 'Tamil',
    type: 'movie',
    video_title: 'Jai Bhim - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=nnXpbTFrqXA'
  },
  
  // Kannada Movies (4 total - 1 exists, adding 3 more)
  {
    title: 'KGF Chapter 2',
    description: 'The blood-soaked land of Kolar Gold Fields has a new overlord now - Rocky, whose name strikes fear in the heart of his foes. His allies look up to him as their savior, the government sees him as a threat, and his enemies are clamoring for revenge.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTAzNzc3NjQwNjVeQTJeQWpwZ15BbWU4MDY0NzE0Mzgz._V1_.jpg',
    release_date: '2022-04-14',
    runtime: 168,
    language: 'Kannada',
    type: 'movie',
    video_title: 'KGF Chapter 2 - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=JKa05nyUmuQ'
  },
  {
    title: 'Kantara',
    description: 'When greed paves the way for betrayal, scheming and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice. A mystical thriller that blends folklore with contemporary issues of land rights and tradition.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYjJiZjg0YzYtZjZmNy00NGM0LWJhODktNzMwNDY5OTg1ZTFhXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg',
    release_date: '2022-09-30',
    runtime: 148,
    language: 'Kannada',
    type: 'movie',
    video_title: 'Kantara - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=8mrVmf239GU'
  },
  {
    title: 'Ugramm',
    description: 'A man goes to extreme lengths to save his family from punishment after the family commits an accidental crime. A gritty action thriller that showcases the lengths a man will go to protect his loved ones.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYwNjQ4NjY5NF5BMl5BanBnXkFtZTgwNzE2NjQ4ODE@._V1_.jpg',
    release_date: '2014-12-05',
    runtime: 132,
    language: 'Kannada',
    type: 'movie',
    video_title: 'Ugramm - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=example_ugramm'
  },
  {
    title: 'Mungaru Male',
    description: 'A young man falls in love with a girl but has to let her go as she is engaged to someone else. A romantic drama set against the backdrop of the beautiful monsoon season in Karnataka.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTY3NjQ4NjY5NF5BMl5BanBnXkFtZTgwNzE2NjQ4ODE@._V1_.jpg',
    release_date: '2006-12-29',
    runtime: 143,
    language: 'Kannada',
    type: 'movie',
    video_title: 'Mungaru Male - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=example_mungaru'
  },
  
  // Marathi Movies (4 total - 1 exists, adding 3 more)
  {
    title: 'Natsamrat',
    description: 'An aging actor, who was once a celebrated artist, faces the harsh realities of life after retirement. A powerful drama about pride, family relationships, and the struggles of old age, based on a famous Marathi play.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYwNjQ4NjY5NF5BMl5BanBnXkFtZTgwNzE2NjQ4ODE@._V1_.jpg',
    release_date: '2016-01-01',
    runtime: 165,
    language: 'Marathi',
    type: 'movie',
    video_title: 'Natsamrat - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=example_natsamrat'
  },
  {
    title: 'Court',
    description: 'An aging folk singer is arrested on charges of abetment of suicide. The film follows the trial in a lower court. A critically acclaimed courtroom drama that offers a stark look at the Indian judicial system.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYwNjQ4NjY5NF5BMl5BanBnXkFtZTgwNzE2NjQ4ODE@._V1_.jpg',
    release_date: '2014-09-05',
    runtime: 116,
    language: 'Marathi',
    type: 'movie',
    video_title: 'Court - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=example_court'
  },
  {
    title: 'Fandry',
    description: 'A young boy from a lower caste falls in love with a girl from a higher caste. A hard-hitting social drama that addresses caste discrimination and young love in rural Maharashtra.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYwNjQ4NjY5NF5BMl5BanBnXkFtZTgwNzE2NjQ4ODE@._V1_.jpg',
    release_date: '2013-02-13',
    runtime: 110,
    language: 'Marathi',
    type: 'movie',
    video_title: 'Fandry - Official Trailer',
    video_url: 'https://www.youtube.com/watch?v=example_fandry'
  }
];

async function addAllLanguageMovies() {
  const client = await pool.connect();
  
  try {
    console.log('🎬 Adding movies for all Indian languages...\n');

    for (const movie of movies) {
      // Add movie
      const movieResult = await client.query(
        `INSERT INTO movies (title, description, poster_url, release_date, runtime, language, type) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [movie.title, movie.description, movie.poster_url, movie.release_date, movie.runtime, movie.language, movie.type]
      );
      
      const movieId = movieResult.rows[0].id;
      
      // Add video
      await client.query(
        `INSERT INTO videos (movie_id, title, video_url, video_type, duration, views_count) 
         VALUES ($1, $2, $3, 'trailer', 150, 0)`,
        [movieId, movie.video_title, movie.video_url]
      );
      
      console.log(`✅ ${movie.language}: ${movie.title}`);
    }

    console.log('\n🎉 ALL MOVIES ADDED!\n');

    // Show summary
    const summary = await client.query(`
      SELECT language, COUNT(*) as count 
      FROM movies 
      WHERE type = 'movie'
      GROUP BY language 
      ORDER BY language
    `);
    
    console.log('📊 Movies by Language:');
    summary.rows.forEach(row => {
      console.log(`  ${row.language}: ${row.count} movies`);
    });

    console.log('\n✅ All movies have trailers with views tracking!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addAllLanguageMovies();
