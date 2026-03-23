const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addPhase4Data() {
  try {
    console.log('🚀 Adding Phase 4 sample data...');

    // Get some movie IDs
    const moviesResult = await pool.query('SELECT id FROM movies LIMIT 10');
    const movieIds = moviesResult.rows.map(r => r.id);

    if (movieIds.length === 0) {
      console.log('❌ No movies found in database');
      return;
    }

    // Add upcoming releases
    console.log('📅 Adding upcoming releases...');
    const today = new Date();
    const upcomingDates = [
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),  // 1 week
      new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month
      new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), // 2 months
      new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), // 3 months
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
    console.log('💰 Adding box office data...');
    for (let i = 0; i < Math.min(3, movieIds.length); i++) {
      await pool.query(`
        INSERT INTO box_office (
          movie_id, weekend_rank, weekend_gross, total_gross, 
          domestic_gross, international_gross, budget, theater_count, 
          week_number, date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT DO NOTHING
      `, [
        movieIds[i],
        i + 1,
        50000000 + Math.floor(Math.random() * 100000000),
        200000000 + Math.floor(Math.random() * 500000000),
        150000000 + Math.floor(Math.random() * 300000000),
        100000000 + Math.floor(Math.random() * 400000000),
        100000000 + Math.floor(Math.random() * 200000000),
        3000 + Math.floor(Math.random() * 2000),
        1,
        new Date()
      ]);
    }
    console.log('✅ Box office data added');

    // Add technical specs
    console.log('🎬 Adding technical specs...');
    const aspectRatios = ['2.39:1', '1.85:1', '16:9', '2.35:1'];
    const soundMixes = ['Dolby Atmos', 'DTS:X', 'Dolby Digital', '5.1 Surround'];
    
    for (let i = 0; i < Math.min(5, movieIds.length); i++) {
      await pool.query(`
        INSERT INTO technical_specs (
          movie_id, aspect_ratio, sound_mix, color_info, 
          camera, film_format
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (movie_id) DO NOTHING
      `, [
        movieIds[i],
        aspectRatios[Math.floor(Math.random() * aspectRatios.length)],
        soundMixes[Math.floor(Math.random() * soundMixes.length)],
        'Color',
        'ARRI Alexa',
        'Digital'
      ]);
    }
    console.log('✅ Technical specs added');

    // Add companies
    console.log('🏢 Adding companies...');
    const companies = [
      { name: 'Warner Bros.', type: 'production' },
      { name: 'Universal Pictures', type: 'production' },
      { name: 'Paramount Pictures', type: 'distributor' },
      { name: 'Sony Pictures', type: 'production' },
      { name: 'Marvel Studios', type: 'production' }
    ];

    for (const company of companies) {
      const result = await pool.query(`
        INSERT INTO companies (name, company_type)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [company.name, company.type]);

      if (result.rows.length > 0) {
        const companyId = result.rows[0].id;
        // Link to first 3 movies
        for (let i = 0; i < Math.min(3, movieIds.length); i++) {
          await pool.query(`
            INSERT INTO movie_companies (movie_id, company_id, role_type)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
          `, [movieIds[i], companyId, company.type]);
        }
      }
    }
    console.log('✅ Companies added');

    console.log('🎉 Phase 4 sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addPhase4Data();
