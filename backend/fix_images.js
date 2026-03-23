const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const movieImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=300&h=450&fit=crop' },
  { id: 2, url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop' },
  { id: 3, url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop' },
  { id: 4, url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop' },
  { id: 5, url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop' }
];

async function fixImages() {
  try {
    console.log('🖼️ Fixing movie images...');
    
    for (const movie of movieImages) {
      await pool.query(
        'UPDATE movies SET poster_url = $1 WHERE id = $2',
        [movie.url, movie.id]
      );
      console.log(`✅ Updated movie ${movie.id} image`);
    }
    
    console.log('🎉 All images fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    process.exit(1);
  }
}

fixImages();