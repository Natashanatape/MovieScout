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
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
        url: 'https://www.netflix.com/in/'
      },
      { 
        name: 'Amazon Prime', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonprime.svg',
        url: 'https://www.primevideo.com/'
      },
      { 
        name: 'Disney+ Hotstar', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/disneyplus.svg',
        url: 'https://www.hotstar.com/'
      },
      { 
        name: 'Sony LIV', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/sony.svg',
        url: 'https://www.sonyliv.com/'
      },
      { 
        name: 'Zee5', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/z.svg',
        url: 'https://www.zee5.com/'
      },
      { 
        name: 'YouTube', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg',
        url: 'https://www.youtube.com/'
      },
      { 
        name: 'Apple TV+', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/appletv.svg',
        url: 'https://tv.apple.com/'
      },
      { 
        name: 'Jio Cinema', 
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jio.svg',
        url: 'https://www.jiocinema.com/'
      }
    ];

    console.log('🎨 Updating platform logos (Simple Icons)...\n');

    for (const p of platforms) {
      await pool.query(`
        UPDATE streaming_platforms 
        SET logo_url = $1, website_url = $2
        WHERE name = $3
      `, [p.logo, p.url, p.name]);
      
      console.log(`✓ ${p.name}`);
    }

    // Update streaming_availability
    await pool.query(`
      UPDATE streaming_availability sa
      SET 
        logo_url = sp.logo_url,
        url = sp.website_url
      FROM streaming_platforms sp
      WHERE sa.platform_id = sp.id
    `);

    console.log('\n✅ All logos updated with Simple Icons (non-copyright)!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateLogos();
