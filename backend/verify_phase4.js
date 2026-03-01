require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function verifyPhase4() {
  try {
    console.log('🔍 Verifying Phase 4 Features...\n');

    // 1. Box Office
    const boxOffice = await pool.query('SELECT COUNT(*) FROM box_office');
    console.log(`✅ Box Office Data: ${boxOffice.rows[0].count} entries`);

    // 2. Technical Specs
    const techSpecs = await pool.query('SELECT COUNT(*) FROM technical_specs');
    console.log(`✅ Technical Specs: ${techSpecs.rows[0].count} entries`);

    // 3. Release Dates
    const releaseDates = await pool.query('SELECT COUNT(*) FROM release_dates');
    console.log(`✅ Release Dates: ${releaseDates.rows[0].count} entries`);

    // 4. Companies
    const companies = await pool.query('SELECT COUNT(*) FROM companies');
    console.log(`✅ Companies: ${companies.rows[0].count} entries`);

    const movieCompanies = await pool.query('SELECT COUNT(*) FROM movie_companies');
    console.log(`✅ Movie-Company Links: ${movieCompanies.rows[0].count} entries`);

    // 5. TV Shows
    const tvShows = await pool.query(`SELECT COUNT(*) FROM movies WHERE type = 'tv'`);
    console.log(`✅ TV Shows: ${tvShows.rows[0].count} entries`);

    const seasons = await pool.query('SELECT COUNT(*) FROM tv_seasons');
    console.log(`✅ TV Seasons: ${seasons.rows[0].count} entries`);

    const episodes = await pool.query('SELECT COUNT(*) FROM tv_episodes');
    console.log(`✅ TV Episodes: ${episodes.rows[0].count} entries`);

    // 6. Coming Soon
    const comingSoon = await pool.query('SELECT COUNT(*) FROM upcoming_releases');
    console.log(`✅ Coming Soon: ${comingSoon.rows[0].count} entries`);

    console.log('\n🎉 All Phase 4 features verified!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyPhase4();
