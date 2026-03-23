const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addStreaming() {
  try {
    // Add platforms
    const platforms = [
      { name: 'Netflix', url: 'https://netflix.com' },
      { name: 'Amazon Prime', url: 'https://primevideo.com' },
      { name: 'Disney+ Hotstar', url: 'https://hotstar.com' },
      { name: 'Sony LIV', url: 'https://sonyliv.com' },
      { name: 'Zee5', url: 'https://zee5.com' },
      { name: 'YouTube', url: 'https://youtube.com' },
      { name: 'Apple TV+', url: 'https://tv.apple.com' },
      { name: 'Jio Cinema', url: 'https://jiocinema.com' }
    ];

    console.log('📺 Adding platforms...\n');
    
    for (const p of platforms) {
      await pool.query(`
        INSERT INTO streaming_platforms (name, website_url, logo_url, country)
        VALUES ($1, $2, $3, 'IN')
        ON CONFLICT DO NOTHING
      `, [p.name, p.url, 'https://via.placeholder.com/100']);
    }

    console.log('✅ Platforms added!');

    // Add streaming availability
    const movies = await pool.query('SELECT id FROM movies LIMIT 50');
    const platformsData = await pool.query('SELECT * FROM streaming_platforms');
    
    console.log(`\n📺 Adding streaming for ${movies.rows.length} movies...\n`);
    
    const types = ['Subscription', 'Rent', 'Buy', 'Free'];
    const qualities = ['HD', 'Full HD', '4K'];
    
    for (const movie of movies.rows) {
      const numPlatforms = Math.floor(Math.random() * 3) + 2;
      const selected = platformsData.rows.sort(() => 0.5 - Math.random()).slice(0, numPlatforms);
      
      for (const platform of selected) {
        const type = types[Math.floor(Math.random() * types.length)];
        const price = type === 'Free' ? 0 : type === 'Subscription' ? 199 : Math.floor(Math.random() * 300) + 50;
        
        await pool.query(`
          INSERT INTO streaming_availability 
          (movie_id, platform_id, platform_name, logo_url, availability_type, price, quality, url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          movie.id,
          platform.id,
          platform.name,
          platform.logo_url,
          type,
          price,
          qualities[Math.floor(Math.random() * qualities.length)],
          platform.website_url
        ]);
      }
    }
    
    console.log('✅ All done! Streaming Guide ready! 🚀');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addStreaming();
