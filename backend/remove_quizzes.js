require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function removeQuizzes() {
  try {
    console.log('🗑️ Removing quizzes...');

    await pool.query('DROP TABLE IF EXISTS quiz_attempts CASCADE');
    await pool.query('DROP TABLE IF EXISTS quiz_answers CASCADE');
    await pool.query('DROP TABLE IF EXISTS quiz_questions CASCADE');
    await pool.query('DROP TABLE IF EXISTS quizzes CASCADE');

    console.log('✅ Quizzes removed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

removeQuizzes();
