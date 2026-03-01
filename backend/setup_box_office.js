require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupBoxOffice() {
  try {
    console.log('💰 Setting up Box Office...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS box_office (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        weekend_rank INTEGER,
        weekend_gross BIGINT,
        total_gross BIGINT,
        domestic_gross BIGINT,
        international_gross BIGINT,
        budget BIGINT,
        theater_count INTEGER,
        week_number INTEGER,
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_box_office_date ON box_office(date);`);

    console.log('✅ Tables created');

    const movies = await pool.query(`SELECT id, title FROM movies WHERE type = 'movie' LIMIT 10`);
    
    if (movies.rows.length === 0) {
      console.log('❌ No movies found');
      return;
    }

    await pool.query('DELETE FROM box_office');

    const today = new Date();
    const lastWeekend = new Date(today);
    lastWeekend.setDate(today.getDate() - 3);

    for (let i = 0; i < movies.rows.length; i++) {
      const movie = movies.rows[i];
      const weekendGross = Math.floor(Math.random() * 50000000) + 10000000;
      const totalGross = weekendGross * (i + 2);
      
      await pool.query(`
        INSERT INTO box_office (movie_id, weekend_rank, weekend_gross, total_gross, domestic_gross, international_gross, budget, theater_count, week_number, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        movie.id,
        i + 1,
        weekendGross,
        totalGross,
        Math.floor(totalGross * 0.6),
        Math.floor(totalGross * 0.4),
        Math.floor(Math.random() * 100000000) + 50000000,
        Math.floor(Math.random() * 3000) + 1000,
        1,
        lastWeekend.toISOString().split('T')[0]
      ]);

      console.log(`✅ Added box office for: ${movie.title}`);
    }

    console.log('\n✅ Box Office setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupBoxOffice();
