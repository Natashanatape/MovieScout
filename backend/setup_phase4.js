const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupPhase4() {
  try {
    console.log('🚀 Starting Phase 4 Setup...\n');

    // Read and execute schema
    console.log('📋 Step 1: Creating database schema...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'src', 'database', 'phase4_schema.sql'),
      'utf8'
    );
    await pool.query(schemaSQL);
    console.log('✅ Database schema created\n');

    // Add sample data
    console.log('📊 Step 2: Adding sample data...');
    
    // Get movie IDs
    const moviesResult = await pool.query('SELECT id FROM movies LIMIT 10');
    const movieIds = moviesResult.rows.map(r => r.id);

    if (movieIds.length === 0) {
      console.log('⚠️  No movies found. Please add movies first.');
      process.exit(0);
    }

    // Add upcoming releases
    const today = new Date();
    const upcomingDates = [
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000),
    ];

    for (let i = 0; i < Math.min(5, movieIds.length); i++) {
      await pool.query(`
        INSERT INTO upcoming_releases (movie_id, release_date, release_type, anticipation_score)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [movieIds[i], upcomingDates[i], 'theatrical', Math.floor(Math.random() * 100)]);
    }
    console.log('✅ Upcoming releases added');

    // Add box office data
    for (let i = 0; i < Math.min(3, movieIds.length); i++) {
      await pool.query(`
        INSERT INTO box_office (
          movie_id, weekend_rank, weekend_gross, total_gross, 
          domestic_gross, international_gross, budget, theater_count, 
          week_number, date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        movieIds[i], i + 1,
        50000000 + Math.floor(Math.random() * 100000000),
        200000000 + Math.floor(Math.random() * 500000000),
        150000000 + Math.floor(Math.random() * 300000000),
        100000000 + Math.floor(Math.random() * 400000000),
        100000000 + Math.floor(Math.random() * 200000000),
        3000 + Math.floor(Math.random() * 2000), 1, new Date()
      ]);
    }
    console.log('✅ Box office data added');

    // Add technical specs
    const aspectRatios = ['2.39:1', '1.85:1', '16:9', '2.35:1'];
    const soundMixes = ['Dolby Atmos', 'DTS:X', 'Dolby Digital', '5.1 Surround'];
    
    for (let i = 0; i < Math.min(5, movieIds.length); i++) {
      await pool.query(`
        INSERT INTO technical_specs (movie_id, aspect_ratio, sound_mix, color_info, camera, film_format)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (movie_id) DO NOTHING
      `, [movieIds[i], aspectRatios[i % 4], soundMixes[i % 4], 'Color', 'ARRI Alexa', 'Digital']);
    }
    console.log('✅ Technical specs added');

    console.log('\n🎉 Phase 4 Setup Complete!\n');
    console.log('Features Added:');
    console.log('- Coming Soon page');
    console.log('- Box Office data');
    console.log('- Technical Specifications');
    console.log('\nVisit: http://localhost:3000/coming-soon\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupPhase4();
