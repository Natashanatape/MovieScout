const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupPhase5() {
  try {
    console.log('🎬 Setting up Phase 5: Advanced Content...\n');
    
    // Run SQL file
    const sql = fs.readFileSync('./setup_phase5.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Tables created!\n');
    
    // Add sample data for first 10 movies
    const movies = await pool.query('SELECT id, title FROM movies LIMIT 10');
    
    console.log('📝 Adding sample data...\n');
    
    for (const movie of movies.rows) {
      // Parental Guide
      const categories = ['Violence', 'Profanity', 'Sex/Nudity', 'Alcohol/Drugs', 'Frightening'];
      const severities = ['None', 'Mild', 'Moderate', 'Severe'];
      
      for (const cat of categories) {
        await pool.query(`
          INSERT INTO parental_guide (movie_id, category, severity, description)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, cat, severities[Math.floor(Math.random() * 4)], `${cat} content in ${movie.title}`]);
      }
      
      // Quotes (3 per movie)
      for (let i = 1; i <= 3; i++) {
        await pool.query(`
          INSERT INTO movie_quotes (movie_id, character_name, quote_text, likes)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, 'Character ' + i, `Memorable quote ${i} from ${movie.title}`, Math.floor(Math.random() * 100)]);
      }
      
      // Filming Locations (2 per movie)
      const locations = ['Mumbai, India', 'New York, USA', 'London, UK', 'Paris, France'];
      for (let i = 0; i < 2; i++) {
        await pool.query(`
          INSERT INTO filming_locations (movie_id, location_name, country, scene_description)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, locations[i], locations[i].split(', ')[1], `Scene filmed at ${locations[i]}`]);
      }
      
      // Soundtracks (5 per movie)
      for (let i = 1; i <= 5; i++) {
        await pool.query(`
          INSERT INTO soundtracks (movie_id, track_title, artist, duration, track_number)
          VALUES ($1, $2, $3, $4, $5)
        `, [movie.id, `Track ${i}`, 'Artist Name', 180 + i * 10, i]);
      }
      
      // Trivia (5 per movie)
      for (let i = 1; i <= 5; i++) {
        await pool.query(`
          INSERT INTO movie_trivia (movie_id, trivia_text, category, likes)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, `Interesting fact ${i} about ${movie.title}`, 'Production', Math.floor(Math.random() * 50)]);
      }
      
      // Goofs (3 per movie)
      const goofTypes = ['Continuity', 'Factual', 'Revealing'];
      for (let i = 0; i < 3; i++) {
        await pool.query(`
          INSERT INTO movie_goofs (movie_id, goof_type, description, timestamp, likes)
          VALUES ($1, $2, $3, $4, $5)
        `, [movie.id, goofTypes[i], `${goofTypes[i]} error in ${movie.title}`, '00:' + (10+i) + ':30', Math.floor(Math.random() * 30)]);
      }
      
      // FAQ (3 per movie)
      for (let i = 1; i <= 3; i++) {
        await pool.query(`
          INSERT INTO movie_faq (movie_id, question, answer, helpful_count)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, `Question ${i} about ${movie.title}?`, `Answer to question ${i}`, Math.floor(Math.random() * 20)]);
      }
      
      console.log(`✓ ${movie.title}`);
    }
    
    console.log('\n✅ Phase 5 setup complete!');
    console.log('\n📊 Summary:');
    console.log('- Parental Guide: 50 entries');
    console.log('- Quotes: 30 entries');
    console.log('- Filming Locations: 20 entries');
    console.log('- Soundtracks: 50 entries');
    console.log('- Trivia: 50 entries');
    console.log('- Goofs: 30 entries');
    console.log('- FAQ: 30 entries');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupPhase5();
