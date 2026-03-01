const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkDates() {
  try {
    const today = new Date();
    
    console.log('📅 Checking release dates distribution:\n');
    
    // This Month (1 month)
    const month1 = new Date(today);
    month1.setMonth(month1.getMonth() + 1);
    const result1 = await pool.query(`
      SELECT COUNT(*), m.title, ur.release_date
      FROM upcoming_releases ur
      JOIN movies m ON ur.movie_id = m.id
      WHERE ur.release_date >= CURRENT_DATE AND ur.release_date <= $1
      GROUP BY m.title, ur.release_date
      ORDER BY ur.release_date
    `, [month1]);
    console.log(`This Month (1 month): ${result1.rows.length} movies`);
    result1.rows.forEach(r => console.log(`  - ${r.title} (${r.release_date.toISOString().split('T')[0]})`));
    
    // Next 3 Months
    const month3 = new Date(today);
    month3.setMonth(month3.getMonth() + 3);
    const result3 = await pool.query(`
      SELECT COUNT(*), m.title, ur.release_date
      FROM upcoming_releases ur
      JOIN movies m ON ur.movie_id = m.id
      WHERE ur.release_date >= CURRENT_DATE AND ur.release_date <= $1
      GROUP BY m.title, ur.release_date
      ORDER BY ur.release_date
    `, [month3]);
    console.log(`\nNext 3 Months: ${result3.rows.length} movies`);
    result3.rows.forEach(r => console.log(`  - ${r.title} (${r.release_date.toISOString().split('T')[0]})`));
    
    // Next 6 Months
    const month6 = new Date(today);
    month6.setMonth(month6.getMonth() + 6);
    const result6 = await pool.query(`
      SELECT COUNT(*), m.title, ur.release_date
      FROM upcoming_releases ur
      JOIN movies m ON ur.movie_id = m.id
      WHERE ur.release_date >= CURRENT_DATE AND ur.release_date <= $1
      GROUP BY m.title, ur.release_date
      ORDER BY ur.release_date
    `, [month6]);
    console.log(`\nNext 6 Months: ${result6.rows.length} movies`);
    result6.rows.forEach(r => console.log(`  - ${r.title} (${r.release_date.toISOString().split('T')[0]})`));
    
    // This Year (12 months)
    const month12 = new Date(today);
    month12.setMonth(month12.getMonth() + 12);
    const result12 = await pool.query(`
      SELECT COUNT(*), m.title, ur.release_date
      FROM upcoming_releases ur
      JOIN movies m ON ur.movie_id = m.id
      WHERE ur.release_date >= CURRENT_DATE AND ur.release_date <= $1
      GROUP BY m.title, ur.release_date
      ORDER BY ur.release_date
    `, [month12]);
    console.log(`\nThis Year (12 months): ${result12.rows.length} movies`);
    result12.rows.forEach(r => console.log(`  - ${r.title} (${r.release_date.toISOString().split('T')[0]})`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDates();
