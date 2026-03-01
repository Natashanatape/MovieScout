const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupPhase3() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 PHASE 3 COMPLETE SETUP STARTING...\n');

    // Read and execute phase3_schema.sql
    const fs = require('fs');
    const phase3SQL = fs.readFileSync('./src/database/phase3_schema.sql', 'utf8');
    
    console.log('📋 Running Phase 3 schema...');
    await client.query(phase3SQL);
    console.log('✅ Phase 3 schema complete!\n');

    // Add sample data
    console.log('📝 Adding sample data...\n');

    // Add sample trivia
    await client.query(`
      INSERT INTO trivia (movie_id, user_id, trivia_text, upvotes) VALUES
      (6, 1, 'The first rule of Fight Club is: You do not talk about Fight Club', 10),
      (8, 1, 'Keanu Reeves kept the sunglasses from the movie', 15)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sample trivia added');

    // Add sample poll
    const pollResult = await client.query(`
      INSERT INTO polls (title, description, created_by) 
      VALUES ('Best Movie of All Time?', 'Vote for your favorite', 1)
      RETURNING id
    `);
    
    if (pollResult.rows.length > 0) {
      const pollId = pollResult.rows[0].id;
      await client.query(`
        INSERT INTO poll_options (poll_id, option_text) VALUES
        ($1, 'Fight Club'),
        ($1, 'The Matrix'),
        ($1, 'Inception')
      `, [pollId]);
      console.log('✅ Sample poll added');
    }

    console.log('\n🎉 PHASE 3 SETUP COMPLETE!\n');

    // Show summary
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('trivia', 'goofs', 'quotes', 'comments', 'user_follows', 'polls', 'notifications', 'video_views')
      ORDER BY table_name
    `);

    console.log('📊 Phase 3 Tables Created:');
    tables.rows.forEach(row => console.log(`  ✅ ${row.table_name}`));

    console.log('\n✅ ALL PHASE 3 FEATURES READY!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupPhase3();
