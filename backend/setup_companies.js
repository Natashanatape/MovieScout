require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupCompanies() {
  try {
    console.log('🏢 Setting up Company Credits...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500),
        country VARCHAR(100),
        company_type VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movie_companies (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        role_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_movie_companies_movie ON movie_companies(movie_id);`);

    console.log('✅ Tables created');

    const companies = [
      { name: 'Warner Bros.', country: 'USA', type: 'Production' },
      { name: 'Universal Pictures', country: 'USA', type: 'Production' },
      { name: 'Paramount Pictures', country: 'USA', type: 'Production' },
      { name: 'Sony Pictures', country: 'USA', type: 'Production' },
      { name: '20th Century Studios', country: 'USA', type: 'Production' },
      { name: 'Netflix', country: 'USA', type: 'Distributor' },
      { name: 'Amazon Studios', country: 'USA', type: 'Distributor' }
    ];

    await pool.query('DELETE FROM movie_companies');
    await pool.query('DELETE FROM companies');

    for (const company of companies) {
      await pool.query(`
        INSERT INTO companies (name, country, company_type, description)
        VALUES ($1, $2, $3, $4)
      `, [company.name, company.country, company.type, `${company.name} is a major ${company.type.toLowerCase()} company.`]);
    }

    console.log('✅ Companies added');

    const movies = await pool.query(`SELECT id, title FROM movies WHERE type = 'movie' LIMIT 10`);
    const companiesResult = await pool.query(`SELECT id FROM companies`);

    for (const movie of movies.rows) {
      const randomCompanies = companiesResult.rows.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      for (const company of randomCompanies) {
        await pool.query(`
          INSERT INTO movie_companies (movie_id, company_id, role_type)
          VALUES ($1, $2, $3)
        `, [movie.id, company.id, Math.random() > 0.5 ? 'Production' : 'Distributor']);
      }

      console.log(`✅ Added companies for: ${movie.title}`);
    }

    console.log('\n✅ Company Credits setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupCompanies();
