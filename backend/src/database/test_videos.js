const db = require('../config/database');

async function testVideos() {
  try {
    // Check if videos table exists
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'videos'
      );
    `);
    console.log('Videos table exists:', tableCheck.rows[0].exists);

    // Count videos
    const countResult = await db.query('SELECT COUNT(*) FROM videos');
    console.log('Total videos:', countResult.rows[0].count);

    // Get sample videos
    const sampleResult = await db.query('SELECT * FROM videos LIMIT 3');
    console.log('Sample videos:', sampleResult.rows);

    // Check featured videos specifically
    const featuredResult = await db.query('SELECT * FROM videos WHERE is_featured = true');
    console.log('Featured videos:', featuredResult.rows.length);

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testVideos();