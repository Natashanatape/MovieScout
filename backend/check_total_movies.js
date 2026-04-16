const db = require('./src/config/database');

const checkMovies = async () => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM movies');
    console.log(`📊 Total movies in database: ${result.rows[0].count}`);
  } catch (error) {
    console.log('❌ Database error:', error.message);
  } finally {
    process.exit();
  }
};

checkMovies();