require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupQuizzes() {
  try {
    console.log('🎯 Setting up quizzes...');

    // Create tables
    await pool.query(`
      DROP TABLE IF EXISTS quiz_attempts CASCADE;
      DROP TABLE IF EXISTS quiz_answers CASCADE;
      DROP TABLE IF EXISTS quiz_questions CASCADE;
      DROP TABLE IF EXISTS quizzes CASCADE;
    `);

    await pool.query(`
      CREATE TABLE quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(20) DEFAULT 'medium',
        total_questions INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_order INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
        answer_text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER,
        total_questions INTEGER,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created');

    // Get movies
    const movies = await pool.query('SELECT id, title FROM movies WHERE type = \'movie\' LIMIT 5');
    
    if (movies.rows.length === 0) {
      console.log('❌ No movies found');
      return;
    }

    // Clear existing
    await pool.query('DELETE FROM quiz_attempts');
    await pool.query('DELETE FROM quiz_answers');
    await pool.query('DELETE FROM quiz_questions');
    await pool.query('DELETE FROM quizzes');

    for (const movie of movies.rows) {
      const quizResult = await pool.query(`
        INSERT INTO quizzes (title, description, difficulty, total_questions)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [
        `${movie.title} Quiz`,
        `Test your knowledge about ${movie.title}`,
        ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        3
      ]);

      const quizId = quizResult.rows[0].id;

      for (let i = 1; i <= 3; i++) {
        const questionResult = await pool.query(`
          INSERT INTO quiz_questions (quiz_id, question_text, question_order)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [quizId, `Question ${i} about ${movie.title}?`, i]);

        const questionId = questionResult.rows[0].id;

        const answers = ['Option A', 'Option B', 'Option C', 'Option D'];
        for (let j = 0; j < 4; j++) {
          await pool.query(`
            INSERT INTO quiz_answers (question_id, answer_text, is_correct)
            VALUES ($1, $2, $3)
          `, [questionId, answers[j], j === 0]);
        }
      }

      console.log(`✅ Added quiz for: ${movie.title}`);
    }

    console.log(`\n✅ Setup complete! Added ${movies.rows.length} quizzes`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupQuizzes();
