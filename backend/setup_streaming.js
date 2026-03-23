const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupStreaming() {
  try {
    // Run SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('./setup_streaming.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Streaming tables created!');
    
    // Add streaming availability for all movies
    const movies = await pool.query('SELECT id FROM movies LIMIT 50');
    const platforms = await pool.query('SELECT id FROM streaming_platforms');
    
    console.log(`\n📺 Adding streaming data for ${movies.rows.length} movies...\n`);
    
    const types = ['Subscription', 'Rent', 'Buy', 'Free'];
    const qualities = ['HD', 'Full HD', '4K'];
    
    for (const movie of movies.rows) {
      // Add 2-4 random platforms per movie
      const numPlatforms = Math.floor(Math.random() * 3) + 2;
      const selectedPlatforms = platforms.rows
        .sort(() => 0.5 - Math.random())
        .slice(0, numPlatforms);
      
      for (const platform of selectedPlatforms) {
        const type = types[Math.floor(Math.random() * types.length)];
        const price = type === 'Free' ? 0 : type === 'Subscription' ? null : Math.floor(Math.random() * 300) + 50;
        
        await pool.query(`
          INSERT INTO streaming_availability 
          (movie_id, platform_id, availability_type, price, quality, url)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          movie.id,
          platform.id,
          type,
          price,
          qualities[Math.floor(Math.random() * qualities.length)],
          'https://example.com/watch'
        ]);
      }
    }
    
    console.log('✅ Streaming data added for all movies!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupStreaming();
