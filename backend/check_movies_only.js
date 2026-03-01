const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkMoviesOnly() {
  try {
    console.log('🔍 Checking Coming Soon...\n');

    const upcoming = await pool.query(`
      SELECT m.id, m.title, m.type 
      FROM upcoming_releases ur
      JOIN movies m ON ur.movie_id = m.id
      WHERE m.type = 'tv_show'
    `);

    if (upcoming.rows.length > 0) {
      console.log(`❌ Found ${upcoming.rows.length} TV shows in Coming Soon:`);
      upcoming.rows.forEach(r => console.log(`  - ${r.title}`));
      
      console.log('\n🧹 Removing TV shows from Coming Soon...');
      await pool.query(`
        DELETE FROM upcoming_releases 
        WHERE movie_id IN (
          SELECT id FROM movies WHERE type = 'tv_show'
        )
      `);
      console.log('✅ TV shows removed from Coming Soon\n');
    } else {
      console.log('✅ No TV shows in Coming Soon\n');
    }

    console.log('🔍 Checking Box Office...\n');

    const boxOffice = await pool.query(`
      SELECT m.id, m.title, m.type 
      FROM box_office bo
      JOIN movies m ON bo.movie_id = m.id
      WHERE m.type = 'tv_show'
    `);

    if (boxOffice.rows.length > 0) {
      console.log(`❌ Found ${boxOffice.rows.length} TV shows in Box Office:`);
      boxOffice.rows.forEach(r => console.log(`  - ${r.title}`));
      
      console.log('\n🧹 Removing TV shows from Box Office...');
      await pool.query(`
        DELETE FROM box_office 
        WHERE movie_id IN (
          SELECT id FROM movies WHERE type = 'tv_show'
        )
      `);
      console.log('✅ TV shows removed from Box Office\n');
    } else {
      console.log('✅ No TV shows in Box Office\n');
    }

    const upcomingCount = await pool.query('SELECT COUNT(*) FROM upcoming_releases');
    const boxOfficeCount = await pool.query('SELECT COUNT(*) FROM box_office');

    console.log('📊 Final Counts:');
    console.log(`  Coming Soon: ${upcomingCount.rows[0].count} movies`);
    console.log(`  Box Office: ${boxOfficeCount.rows[0].count} movies\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkMoviesOnly();
