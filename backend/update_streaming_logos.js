const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function updateLogos() {
  try {
    const platforms = [
      { 
        name: 'Netflix', 
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=200&fit=crop',
        url: 'https://www.netflix.com/in/'
      },
      { 
        name: 'Amazon Prime', 
        logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=200&fit=crop',
        url: 'https://www.primevideo.com/'
      },
      { 
        name: 'Disney+ Hotstar', 
        logo: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=200&fit=crop',
        url: 'https://www.hotstar.com/'
      },
      { 
        name: 'Sony LIV', 
        logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop',
        url: 'https://www.sonyliv.com/'
      },
      { 
        name: 'Zee5', 
        logo: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=200&fit=crop',
        url: 'https://www.zee5.com/'
      },
      { 
        name: 'YouTube', 
        logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop',
        url: 'https://www.youtube.com/'
      },
      { 
        name: 'Apple TV+', 
        logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop',
        url: 'https://tv.apple.com/'
      },
      { 
        name: 'Jio Cinema', 
        logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
        url: 'https://www.jiocinema.com/'
      }
    ];

    console.log('🎨 Updating platform logos and links...\n');

    for (const p of platforms) {
      await pool.query(`
        UPDATE streaming_platforms 
        SET logo_url = $1, website_url = $2
        WHERE name = $3
      `, [p.logo, p.url, p.name]);
      
      console.log(`✓ ${p.name}`);
    }

    // Update streaming_availability with platform info
    await pool.query(`
      UPDATE streaming_availability sa
      SET 
        logo_url = sp.logo_url,
        url = sp.website_url
      FROM streaming_platforms sp
      WHERE sa.platform_id = sp.id
    `);

    console.log('\n✅ All logos and links updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateLogos();
