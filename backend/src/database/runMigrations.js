const db = require('../config/database');

async function runMigrations() {
  console.log('🔄 Running migrations...');

  try {
    // Enable UUID extension
    await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Drop existing tables if they have issues
    await db.query('DROP TABLE IF EXISTS movie_streaming CASCADE;');
    await db.query('DROP TABLE IF EXISTS streaming_platforms CASCADE;');
    await db.query('DROP TABLE IF EXISTS collection_movies CASCADE;');
    await db.query('DROP TABLE IF EXISTS collections CASCADE;');
    await db.query('DROP TABLE IF EXISTS user_activities CASCADE;');
    await db.query('DROP TABLE IF EXISTS list_items CASCADE;');

    // 1. Add language columns
    await db.query(`
      ALTER TABLE movies 
      ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English',
      ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'USA',
      ADD COLUMN IF NOT EXISTS industry VARCHAR(50);
    `);

    // 2. Create streaming tables
    await db.query(`
      CREATE TABLE streaming_platforms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        logo_url VARCHAR(500),
        website_url VARCHAR(500),
        country VARCHAR(50) DEFAULT 'Global',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE movie_streaming (
        id SERIAL PRIMARY KEY,
        movie_id UUID,
        platform_id INTEGER REFERENCES streaming_platforms(id) ON DELETE CASCADE,
        available BOOLEAN DEFAULT true,
        stream_url VARCHAR(500),
        price DECIMAL(10,2),
        currency VARCHAR(10) DEFAULT 'USD',
        type VARCHAR(20) DEFAULT 'subscription',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Create collections tables
    await db.query(`
      CREATE TABLE collections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        poster_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE collection_movies (
        id SERIAL PRIMARY KEY,
        collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
        movie_id UUID,
        order_number INTEGER
      );
    `);

    // 4. Create activities table
    await db.query(`
      CREATE TABLE user_activities (
        id SERIAL PRIMARY KEY,
        user_id UUID,
        activity_type VARCHAR(50) NOT NULL,
        movie_id UUID,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 5. Create list_items table
    await db.query(`
      CREATE TABLE list_items (
        id SERIAL PRIMARY KEY,
        list_id UUID,
        movie_id UUID,
        order_number INTEGER,
        added_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 6. Create photos table
    await db.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        photo_url TEXT NOT NULL,
        thumbnail_url TEXT,
        category VARCHAR(50) DEFAULT 'poster',
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_photos_movie ON photos(movie_id);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
    `);

    console.log('✅ Photos table created');

    // 7. Phase 4: Create release_reminders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS release_reminders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        movie_id INTEGER,
        remind_date DATE NOT NULL,
        notification_type VARCHAR(20) DEFAULT 'both',
        notified BOOLEAN DEFAULT false,
        email_sent BOOLEAN DEFAULT false,
        push_sent BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      );
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_release_reminders_user ON release_reminders(user_id);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_release_reminders_date ON release_reminders(remind_date);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_release_reminders_notified ON release_reminders(notified);
    `);

    console.log('✅ Phase 4: Release reminders table created');

    // Insert data
    const collectionsCheck = await db.query('SELECT COUNT(*) FROM collections');
    if (collectionsCheck.rows[0].count === '0') {
      await db.query(`
        INSERT INTO collections (name, description) VALUES
        ('Marvel Cinematic Universe', 'The complete MCU saga'),
        ('DC Extended Universe', 'DC superhero movies'),
        ('Harry Potter', 'The wizarding world saga'),
        ('Fast & Furious', 'High-octane action franchise'),
        ('Baahubali Series', 'Epic Indian fantasy'),
        ('KGF Series', 'Kannada blockbuster franchise');
      `);
    }

    const platformsCheck = await db.query('SELECT COUNT(*) FROM streaming_platforms');
    if (platformsCheck.rows[0].count === '0') {
      await db.query(`
        INSERT INTO streaming_platforms (name, website_url, country) VALUES
        ('Netflix', 'https://netflix.com', 'Global'),
        ('Amazon Prime Video', 'https://primevideo.com', 'Global'),
        ('Disney+ Hotstar', 'https://hotstar.com', 'India'),
        ('Zee5', 'https://zee5.com', 'India'),
        ('SonyLIV', 'https://sonyliv.com', 'India');
      `);
    }

    console.log('✅ All migrations completed!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  }
}

module.exports = runMigrations;
