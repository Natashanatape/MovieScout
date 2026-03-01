const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupPhase5Fresh() {
  try {
    console.log('🎬 Setting up Phase 5 (Fresh)...\n');
    
    // Drop existing Phase 5 tables if they exist
    console.log('🗑️  Cleaning old tables...');
    await pool.query(`
      DROP TABLE IF EXISTS movie_faq CASCADE;
      DROP TABLE IF EXISTS movie_connections CASCADE;
      DROP TABLE IF EXISTS crazy_credits CASCADE;
      DROP TABLE IF EXISTS movie_goofs CASCADE;
      DROP TABLE IF EXISTS movie_trivia CASCADE;
      DROP TABLE IF EXISTS alternative_versions CASCADE;
      DROP TABLE IF EXISTS soundtracks CASCADE;
      DROP TABLE IF EXISTS filming_locations CASCADE;
      DROP TABLE IF EXISTS movie_quotes CASCADE;
      DROP TABLE IF EXISTS parental_guide CASCADE;
    `);
    
    console.log('✅ Old tables dropped\n');
    
    // Create new tables
    console.log('📦 Creating new tables...');
    
    await pool.query(`
      CREATE TABLE parental_guide (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        severity VARCHAR(20),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE movie_quotes (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        character_name VARCHAR(255),
        quote_text TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE filming_locations (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        location_name VARCHAR(255) NOT NULL,
        country VARCHAR(100),
        scene_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE soundtracks (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        track_title VARCHAR(255) NOT NULL,
        artist VARCHAR(255),
        duration INTEGER,
        track_number INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE movie_trivia (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        trivia_text TEXT NOT NULL,
        category VARCHAR(50),
        is_spoiler BOOLEAN DEFAULT false,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE movie_goofs (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        goof_type VARCHAR(50),
        description TEXT NOT NULL,
        timestamp VARCHAR(20),
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE movie_faq (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        is_spoiler BOOLEAN DEFAULT false,
        helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tables created\n');
    
    // Add sample data
    console.log('📝 Adding sample data...\n');
    
    const movies = await pool.query('SELECT id, title FROM movies LIMIT 20');
    
    for (const movie of movies.rows) {
      // Parental Guide
      const categories = [
        {cat: 'Violence', sev: 'Moderate', desc: 'Contains action sequences and mild violence'},
        {cat: 'Profanity', sev: 'Mild', desc: 'Occasional use of mild language'},
        {cat: 'Sex/Nudity', sev: 'None', desc: 'No sexual content or nudity'},
        {cat: 'Alcohol/Drugs', sev: 'Mild', desc: 'Brief scenes showing alcohol consumption'},
        {cat: 'Frightening', sev: 'Moderate', desc: 'Some intense scenes that may frighten young children'}
      ];
      
      for (const c of categories) {
        await pool.query(`
          INSERT INTO parental_guide (movie_id, category, severity, description)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, c.cat, c.sev, c.desc]);
      }
      
      // Quotes (3)
      const quotes = [
        {char: 'Main Character', text: 'This is where the journey begins.'},
        {char: 'Supporting Character', text: 'Sometimes the hardest choices require the strongest wills.'},
        {char: 'Villain', text: 'You could not live with your own failure.'}
      ];
      
      for (const q of quotes) {
        await pool.query(`
          INSERT INTO movie_quotes (movie_id, character_name, quote_text, likes)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, q.char, q.text, Math.floor(Math.random() * 100)]);
      }
      
      // Filming Locations (2)
      const locations = [
        {name: 'Mumbai, Maharashtra', country: 'India', desc: 'Major action sequences filmed here'},
        {name: 'New York City', country: 'USA', desc: 'Climax scenes shot on location'}
      ];
      
      for (const loc of locations) {
        await pool.query(`
          INSERT INTO filming_locations (movie_id, location_name, country, scene_description)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, loc.name, loc.country, loc.desc]);
      }
      
      // Soundtracks (5)
      for (let i = 1; i <= 5; i++) {
        await pool.query(`
          INSERT INTO soundtracks (movie_id, track_title, artist, duration, track_number)
          VALUES ($1, $2, $3, $4, $5)
        `, [movie.id, `Track ${i}`, 'Composer Name', 180 + i * 15, i]);
      }
      
      // Trivia (5)
      const triviaList = [
        'The director spent 3 years developing this project',
        'Over 500 visual effects shots were created for this film',
        'The lead actor performed most of their own stunts',
        'This was filmed in 5 different countries',
        'The budget was increased by 30% during production'
      ];
      
      for (const t of triviaList) {
        await pool.query(`
          INSERT INTO movie_trivia (movie_id, trivia_text, category, likes)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, t, 'Production', Math.floor(Math.random() * 50)]);
      }
      
      // Goofs (3)
      const goofs = [
        {type: 'Continuity', desc: 'Character\'s watch changes between shots', time: '00:15:30'},
        {type: 'Factual', desc: 'Historical date mentioned is incorrect', time: '00:45:20'},
        {type: 'Revealing', desc: 'Camera visible in mirror reflection', time: '01:10:15'}
      ];
      
      for (const g of goofs) {
        await pool.query(`
          INSERT INTO movie_goofs (movie_id, goof_type, description, timestamp, likes)
          VALUES ($1, $2, $3, $4, $5)
        `, [movie.id, g.type, g.desc, g.time, Math.floor(Math.random() * 30)]);
      }
      
      // FAQ (3)
      const faqs = [
        {q: 'Is this based on a true story?', a: 'No, this is a work of fiction inspired by real events.'},
        {q: 'Will there be a sequel?', a: 'The director has expressed interest in continuing the story.'},
        {q: 'What is the meaning of the ending?', a: 'The ending is intentionally ambiguous, leaving it open to interpretation.'}
      ];
      
      for (const f of faqs) {
        await pool.query(`
          INSERT INTO movie_faq (movie_id, question, answer, helpful_count)
          VALUES ($1, $2, $3, $4)
        `, [movie.id, f.q, f.a, Math.floor(Math.random() * 20)]);
      }
      
      console.log(`✓ ${movie.title}`);
    }
    
    console.log('\n✅ Phase 5 setup complete!');
    console.log('\n📊 Data Summary:');
    console.log('- Parental Guide: 100 entries (5 per movie)');
    console.log('- Quotes: 60 entries (3 per movie)');
    console.log('- Filming Locations: 40 entries (2 per movie)');
    console.log('- Soundtracks: 100 entries (5 per movie)');
    console.log('- Trivia: 100 entries (5 per movie)');
    console.log('- Goofs: 60 entries (3 per movie)');
    console.log('- FAQ: 60 entries (3 per movie)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupPhase5Fresh();
