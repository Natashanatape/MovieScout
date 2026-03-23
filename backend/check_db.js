const pool = require('./src/config/database');

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('polls', 'quizzes', 'awards', 'trivia', 'comments', 'notifications')
      ORDER BY table_name
    `);
    
    console.log('\n=== Phase 3 Tables Check ===');
    if (result.rows.length > 0) {
      console.log('✅ Found tables:', result.rows.map(r => r.table_name).join(', '));
      console.log('\n✅ Database is setup!');
    } else {
      console.log('❌ No Phase 3 tables found!');
      console.log('❌ Database setup needed!');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTables();
