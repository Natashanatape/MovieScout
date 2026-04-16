const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function verifyAndFix() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying images and database...\n');
    
    // Check if images exist
    const imagesDir = path.join(__dirname, 'public', 'images');
    console.log('📁 Images directory:', imagesDir);
    
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      console.log('✅ Found images:', files.join(', '));
      console.log('📊 Total local images:', files.length, '\n');
    } else {
      console.log('❌ Images directory not found!\n');
    }
    
    // Check database movies
    const result = await client.query(
      'SELECT id, title, poster_url FROM movies ORDER BY id DESC LIMIT 10'
    );
    
    console.log('📊 Latest movies in database:');
    console.log('─'.repeat(80));
    result.rows.forEach(movie => {
      const isLocal = movie.poster_url.includes('localhost');
      const icon = isLocal ? '🖼️' : '🌐';
      console.log(`${icon} ID: ${movie.id} | ${movie.title}`);
      console.log(`   URL: ${movie.poster_url}\n`);
    });
    
    console.log('✨ Verification complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure backend server is running: npm run dev');
    console.log('2. Backend should be on: http://localhost:5001');
    console.log('3. Images will be served from: http://localhost:5001/images/');
    console.log('4. Refresh your frontend to see the changes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyAndFix();
