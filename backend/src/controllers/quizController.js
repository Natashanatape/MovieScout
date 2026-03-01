const pool = require('../config/database');

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, category, difficulty, questions } = req.body;
    
    const quizResult = await pool.query(
      'INSERT INTO quizzes (title, category, difficulty) VALUES ($1, $2, $3) RETURNING *',
      [title, category, difficulty]
    );
    
    const quiz = quizResult.rows[0];
    
    for (const q of questions) {
      await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, options_json) VALUES ($1, $2, $3, $4)',
        [quiz.id, q.question, q.correct_answer, JSON.stringify(q.options)]
      );
    }
    
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM quizzes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Quiz with Questions
exports.getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    const questions = await pool.query(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1',
      [id]
    );
    
    res.json({ ...quiz.rows[0], questions: questions.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Quiz Attempt
exports.submitAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const user_id = req.user.id;
    
    const questions = await pool.query(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1',
      [id]
    );
    
    let score = 0;
    questions.rows.forEach((q, index) => {
      if (answers[index] === q.correct_answer) score++;
    });
    
    await pool.query(
      'INSERT INTO quiz_attempts (quiz_id, user_id, score) VALUES ($1, $2, $3)',
      [id, user_id, score]
    );
    
    res.json({ score, total: questions.rows.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.username, SUM(qa.score) as total_score, COUNT(qa.id) as quizzes_taken
       FROM quiz_attempts qa
       JOIN users u ON qa.user_id = u.id
       GROUP BY u.id, u.username
       ORDER BY total_score DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
