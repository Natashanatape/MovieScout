const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addPhase5Data() {
  try {
    console.log('📝 Adding Phase 5 data...\n');
    
    const movies = await pool.query('SELECT id, title FROM movies LIMIT 20');
    
    for (const movie of movies.rows) {
      // Parental Guide
      const categories = ['Violence', 'Profanity', 'Sex/Nudity', 'Alcohol/Drugs', 'Frightening'];
      const severities = ['None', 'Mild', 'Moderate', 'Severe'];
      
      for (const cat of categories) {
        await pool.query(`
          INSERT INTO parental_guide (movie_id, category, severity, description)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
        `, [movie.id, cat, severities[Math.floor(Math.random() * 4)], `${cat} content description for ${movie.title}`]);
      }
      
      // Quotes
      for (let i = 1; i <= 3; i++) {
        await pool.query(`
          INSERT INTO movie_quotes (movie_id, character_name, quote_text, likes)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, 'Character ' + i, `"Memorable quote ${i} from ${movie.title}"`, Math.floor(Math.random() * 100)]);
      }
      
      // Filming Locations
      const locations = [
        {name: 'Mumbai, Maharashtra', country: 'India'},
        {name: 'New York City', country: 'USA'},
        {name: 'London', country: 'UK'}
      ];
      for (let i = 0; i < 2; i++) {
        await pool.query(`
          INSERT INTO filming_locations (movie_id, location_name, country, scene_description)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, locations[i].name, locations[i].country, `Key scenes filmed at ${locations[i].name}`]);
      }
      
      // Soundtracks
      for (let i = 1; i <= 5; i++) {
        await pool.query(`
          INSERT INTO soundtracks (movie_id, track_title, artist, duration, track_number)
          VALUES ($1, $2, $3, $4, $5)
        `, [movie.id, `Track ${i} - ${movie.title}`, 'Composer Name', 180 + i * 15, i]);
      }
      
      // Trivia
      for (let i = 1; i <= 5; i++) {
        await pool.query(`
          INSERT INTO movie_trivia (movie_id, trivia_text, category, likes)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, `Did you know? Interesting fact ${i} about the making of ${movie.title}`, 'Production', Math.floor(Math.random() * 50)]);
      }
      
      // Goofs
      const goofTypes = ['Continuity', 'Factual', 'Revealing'];
      for (let i = 0; i < 3; i++) {
        await pool.query(`
          INSERT INTO movie_goofs (movie_id, goof_type, description, timestamp, likes)
          VALUES ($1, $2, $3, $4, $5)
        `, [movie.id, goofTypes[i], `${goofTypes[i]} error spotted in ${movie.title}`, '00:' + (10+i*5) + ':30', Math.floor(Math.random() * 30)]);
      }
      
      // FAQ
      for (let i = 1; i <= 3; i++) {
        await pool.query(`
          INSERT INTO movie_faq (movie_id, question, answer, helpful_count)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, `Frequently asked question ${i} about ${movie.title}?`, `Detailed answer to question ${i} explaining the plot/production details.`, Math.floor(Math.random() * 20)]);
      }
      
      console.log(`✓ ${movie.title}`);
    }
    
    console.log('\n✅ Phase 5 data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPhase5Data();
