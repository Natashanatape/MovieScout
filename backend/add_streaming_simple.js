const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addStreamingData() {
  try {
    // Check if tables exist, if not create them
    await pool.query(`
      CREATE TABLE IF NOT EXISTS streaming_platforms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        logo_url TEXT,
        subscription_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS streaming_availability (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        platform_id INTEGER,
        availability_type VARCHAR(50),
        price DECIMAL(10,2),
        quality VARCHAR(20),
        url TEXT,
        platform_name VARCHAR(100),
        logo_url TEXT,
        subscription_price DECIMAL(10,2),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables ready!');

    // Add platforms
    const platforms = [
      { name: 'Netflix', price: 199 },
      { name: 'Amazon Prime', price: 299 },
      { name: 'Disney+ Hotstar', price: 499 },
      { name: 'Sony LIV', price: 299 },
      { name: 'Zee5', price: 99 },
      { name: 'YouTube', price: 0 },
      { name: 'Apple TV+', price: 99 },
      { name: 'Jio Cinema', price: 0 }
    ];

    for (const p of platforms) {
      await pool.query(`
        INSERT INTO streaming_platforms (name, subscription_price, logo_url)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [p.name, p.price, 'https://via.placeholder.com/100']);
    }

    console.log('✅ Platforms added!');

    // Add streaming data for movies
    const movies = await pool.query('SELECT id FROM movies LIMIT 50');
    const platformsData = await pool.query('SELECT id, name, subscription_price, logo_url FROM streaming_platforms');
    
    console.log(`\n📺 Adding streaming for ${movies.rows.length} movies...\n`);
    
    const types = ['Subscription', 'Rent', 'Buy', 'Free'];
    const qualities = ['HD', 'Full HD', '4K'];
    
    for (const movie of movies.rows) {
      const numPlatforms = Math.floor(Math.random() * 3) + 2;
      const selected = platformsData.rows.sort(() => 0.5 - Math.random()).slice(0, numPlatforms);
      
      for (const platform of selected) {
        const type = types[Math.floor(Math.random() * types.length)];
        const price = type === 'Free' ? 0 : type === 'Subscription' ? null : Math.floor(Math.random() * 300) + 50;
        
        await pool.query(`
          INSERT INTO streaming_availability 
          (movie_id, platform_id, platform_name, logo_url, subscription_price, availability_type, price, quality, url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          movie.id,
          platform.id,
          platform.name,
          platform.logo_url,
          platform.subscription_price,
          type,
          price,
          qualities[Math.floor(Math.random() * qualities.length)],
          'https://example.com/watch'
        ]);
      }
    }
    
    console.log('✅ Streaming data added!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addStreamingData();
