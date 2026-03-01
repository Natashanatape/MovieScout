require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupTechnicalSpecs() {
  try {
    console.log('🎬 Setting up Technical Specs...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS technical_specs (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        aspect_ratio VARCHAR(50),
        sound_mix VARCHAR(255),
        color_info VARCHAR(100),
        camera VARCHAR(255),
        laboratory VARCHAR(255),
        film_format VARCHAR(100),
        cinematographic_process VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(movie_id)
      );
    `);

    console.log('✅ Tables created');

    const movies = await pool.query(`SELECT id, title FROM movies WHERE type = 'movie' LIMIT 10`);
    
    if (movies.rows.length === 0) {
      console.log('❌ No movies found');
      return;
    }

    await pool.query('DELETE FROM technical_specs');

    const aspectRatios = ['2.39:1', '1.85:1', '16:9', '2.35:1'];
    const soundMixes = ['Dolby Atmos', 'DTS:X', 'Dolby Digital', 'IMAX 6-Track'];
    const cameras = ['ARRI Alexa', 'RED Dragon', 'Sony Venice', 'Panavision'];

    for (const movie of movies.rows) {
      await pool.query(`
        INSERT INTO technical_specs (movie_id, aspect_ratio, sound_mix, color_info, camera, film_format, cinematographic_process)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        movie.id,
        aspectRatios[Math.floor(Math.random() * aspectRatios.length)],
        soundMixes[Math.floor(Math.random() * soundMixes.length)],
        'Color',
        cameras[Math.floor(Math.random() * cameras.length)],
        'Digital',
        'Digital Intermediate'
      ]);

      console.log(`✅ Added specs for: ${movie.title}`);
    }

    console.log('\n✅ Technical Specs setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupTechnicalSpecs();
