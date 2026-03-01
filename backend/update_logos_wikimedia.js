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
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
        url: 'https://www.netflix.com/in/'
      },
      { 
        name: 'Amazon Prime', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
        url: 'https://www.primevideo.com/'
      },
      { 
        name: 'Disney+ Hotstar', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
        url: 'https://www.hotstar.com/'
      },
      { 
        name: 'Sony LIV', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Sony_liv.png',
        url: 'https://www.sonyliv.com/'
      },
      { 
        name: 'Zee5', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/ZEE5_logo.svg',
        url: 'https://www.zee5.com/'
      },
      { 
        name: 'YouTube', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg',
        url: 'https://www.youtube.com/'
      },
      { 
        name: 'Apple TV+', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
        url: 'https://tv.apple.com/'
      },
      { 
        name: 'Jio Cinema', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/JioCinema_Logo.svg',
        url: 'https://www.jiocinema.com/'
      }
    ];

    console.log('🎨 Updating platform logos (Wikimedia)...\n');

    for (const p of platforms) {
      await pool.query(`
        UPDATE streaming_platforms 
        SET logo_url = $1, website_url = $2
        WHERE name = $3
      `, [p.logo, p.url, p.name]);
      
      console.log(`✓ ${p.name}`);
    }

    await pool.query(`
      UPDATE streaming_availability sa
      SET 
        logo_url = sp.logo_url,
        url = sp.website_url
      FROM streaming_platforms sp
      WHERE sa.platform_id = sp.id
    `);

    console.log('\n✅ All logos updated with proper images from Wikimedia!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateLogos();
