const db = require('./src/config/database');

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n');

    // 1. Add role column to users table
    console.log('📝 Adding role column to users...');
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'
    `);
    await db.query(`UPDATE users SET role = 'user' WHERE role IS NULL`);
    console.log('✅ Role column added\n');

    // 2. Add views_count to movies table
    console.log('📝 Adding views_count to movies...');
    await db.query(`
      ALTER TABLE movies 
      ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0
    `);
    await db.query(`
      UPDATE movies 
      SET views_count = FLOOR(RANDOM() * 1000000 + 100000) 
      WHERE views_count = 0
    `);
    console.log('✅ Views count added to movies\n');

    // 3. Create video_views table
    console.log('📝 Creating video_views table...');
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
    console.log('✅ video_views table created\n');

    // 4. Add views_count to videos table
    console.log('📝 Adding views_count to videos...');
    await db.query(`
      ALTER TABLE videos 
      ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0
    `);
    await db.query(`
      UPDATE videos 
      SET views_count = FLOOR(RANDOM() * 10000 + 1000) 
      WHERE views_count = 0
    `);
    console.log('✅ Views count added to videos\n');

    // 5. Create indexes
    console.log('📝 Creating indexes...');
    await db.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_video_views_video ON video_views(video_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_video_views_user ON video_views(user_id)`);
    console.log('✅ Indexes created\n');

    // 6. Create admin_logs table
    console.log('📝 Creating admin_logs table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        target_type VARCHAR(50),
        target_id INTEGER,
        details JSONB,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at)`);
    console.log('✅ admin_logs table created\n');

    // 7. Create admin_settings table
    console.log('📝 Creating admin_settings table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        description TEXT,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default settings
    await db.query(`
      INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
      ('site_name', 'MovieScout', 'Website name'),
      ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
      ('user_registration', 'true', 'Allow new user registrations'),
      ('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
      ('featured_movies_count', '10', 'Number of featured movies on homepage')
      ON CONFLICT (setting_key) DO NOTHING
    `);
    console.log('✅ admin_settings table created\n');

    console.log('✅ Migration completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
