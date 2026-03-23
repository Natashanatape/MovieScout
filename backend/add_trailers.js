const db = require('./src/config/database');

const addTrailers = async () => {
  try {
    const trailers = {
      'Interstellar': 'zSWdZVtXT7E',
      'Gladiator': 'owK1qxDselE',
      'The Silence of the Lambs': 'W6Mm8Sbe__o',
      'Saving Private Ryan': 'zwhP5b4tD6g',
      'The Green Mile': 'Ki4haFrqSrw',
      'Parasite': '5xH0HfJHsaY',
      'Avengers: Endgame': 'TcMBFSGVi1c',
      'Joker': 'zAGVQLHvwOY',
      'The Lion King': '4sj1MT05lAA',
      'Titanic': 'kVrqfYjkTdQ',
      'The Departed': 'SGWvwjZ0eDc',
      'Whiplash': '7d_jQycdQGo',
      'The Prestige': 'o4gHCmTQDVI',
      'The Shining': '5Cb3ik6zP2I',
      'Goodfellas': 'qo5jJpHtI1Y',
      'Schindler\'s List': 'gG22XNhtnoY',
      'The Avengers': 'eOrNdBpGMv8',
      'Spider-Man: No Way Home': 'JfVOs4VSpmA',
      'Dune': '8g18jFHCLXk',
      'Oppenheimer': 'uYPbbksJxIg',
      '3 Idiots': 'K0eDlFX9GMc',
      'Dangal': 'x_7YlGv9u1g',
      'PK': 'VrXBHbp7vqI',
      'Lagaan': 'isyHbMZyLvI',
      'Taare Zameen Par': 'TrsV_ezjhGA',
      'Drishyam': 'AuuX2j14NBg',
      'Zindagi Na Milegi Dobara': 'KjS2e0nKAYw',
      'Bajrangi Bhaijaan': '4nwAra0mz_Q',
      'Andhadhun': 'vGeLwVZkHx0',
      'Gully Boy': 'JFdF9wgJdPM',
      'The Shawshank Redemption': '6hB3S9bIaco',
      'The Godfather': 'sY1S34973zA',
      'The Dark Knight': 'EXeTwQWrcwY',
      'Pulp Fiction': 's7EdQ4FqbhY',
      'Inception': 'YoHD9XEInc0',
      'Fight Club': 'qtRKdVHc-cE',
      'Forrest Gump': 'bLvqoHBptjg',
      'The Matrix': 'm8e-FF8MsqU',
      'The Hangover': 'tcdUhdOlz9M',
      'The Conjuring': 'k10ETZ41q5o',
      'Indiana Jones and the Raiders of the Lost Ark': 'XkkzKHCx154'
    };

    console.log('🎬 Adding trailers for all movies...\n');

    for (const [movieTitle, youtubeId] of Object.entries(trailers)) {
      const movieResult = await db.query('SELECT id FROM movies WHERE title = $1', [movieTitle]);
      
      if (movieResult.rows.length > 0) {
        const movieId = movieResult.rows[0].id;
        
        const existingVideo = await db.query(
          'SELECT id FROM videos WHERE movie_id = $1 AND video_type = $2',
          [movieId, 'trailer']
        );

        if (existingVideo.rows.length === 0) {
          await db.query(
            `INSERT INTO videos (movie_id, title, video_url, thumbnail_url, video_type, duration, quality)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              movieId,
              'Official Trailer',
              youtubeId,
              `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
              'trailer',
              180,
              '1080p'
            ]
          );
          console.log(`✅ Added trailer for: ${movieTitle}`);
        } else {
          console.log(`⚠️  Trailer already exists for: ${movieTitle}`);
        }
      } else {
        console.log(`❌ Movie not found: ${movieTitle}`);
      }
    }

    console.log('\n✅ All trailers added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding trailers:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

addTrailers();
