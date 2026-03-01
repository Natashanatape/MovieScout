require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addQuizzes() {
  try {
    console.log('🎯 Adding quizzes...');

    // Get some movies
    const movies = await pool.query('SELECT id, title FROM movies LIMIT 5');
    
    if (movies.rows.length === 0) {
      console.log('❌ No movies found');
      return;
    }

    // Clear existing
    await pool.query('DELETE FROM quiz_answers');
    await pool.query('DELETE FROM quiz_questions');
    await pool.query('DELETE FROM quizzes');

    for (const movie of movies.rows) {
      // Create quiz
      const quizResult = await pool.query(`
        INSERT INTO quizzes (movie_id, title, description, difficulty, total_questions)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        movie.id,
        `${movie.title} Quiz`,
        `Test your knowledge about ${movie.title}`,
        ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        3
      ]);

      const quizId = quizResult.rows[0].id;

      // Add 3 questions
      for (let i = 1; i <= 3; i++) {
        const questionResult = await pool.query(`
          INSERT INTO quiz_questions (quiz_id, question_text, question_order)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [quizId, `Question ${i} about ${movie.title}?`, i]);

        const questionId = questionResult.rows[0].id;

        // Add 4 answers
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

    console.log(`\n✅ Added ${movies.rows.length} quizzes`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addQuizzes();
