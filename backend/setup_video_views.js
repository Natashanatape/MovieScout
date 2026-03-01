const db = require('./src/config/database');

async function setupVideoViews() {
  try {
    console.log('🔧 Setting up video views...');

    // Create video_views table
    await db.query(`
      CREATE TABLE IF NOT EXISTS video_views (
        id SERIAL PRIMARY KEY,
        video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ip_address VARCHAR(45),
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        watch_duration INTEGER DEFAULT 0
      )
    `);
    console.log('✅ video_views table created');

    // Add views_count column to videos
    await db.query(`
      ALTER TABLE videos ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0
    `);
    console.log('✅ views_count column added');

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_video_views_video ON video_views(video_id)
    `);
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_video_views_user ON video_views(user_id)
    `);
    console.log('✅ Indexes created');

    // Add some sample views
    const videos = await db.query('SELECT id FROM videos LIMIT 10');
    
    for (const video of videos.rows) {
      const viewCount = Math.floor(Math.random() * 10000) + 1000;
      await db.query(
        'UPDATE videos SET views_count = $1 WHERE id = $2',
        [viewCount, video.id]
      );
    }
    console.log('✅ Sample views added');

    console.log('\n✅ Video views setup complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupVideoViews();
