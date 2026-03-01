import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/quizzes');
      setQuizzes(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/quizzes/${quizId}`);
      setSelectedQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(''));
      setResult(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5001/api/quizzes/${selectedQuiz.id}/attempt`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (error) {
      alert('Please login to submit quiz');
    }
  };

  if (selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => setSelectedQuiz(null)} className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2 font-semibold transition">
            ← Back to Quizzes
          </button>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-purple-500/20 mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">{selectedQuiz.title}</h1>
            <p className="text-purple-300">Answer all questions to see your score</p>
          </div>
          
          {!result ? (
            <div className="space-y-6">
              {selectedQuiz.questions.map((q, index) => (
                <div key={q.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-purple-500/20">
                  <h3 className="font-bold mb-4 text-white text-lg">Question {index + 1}: {q.question_text}</h3>
                  <div className="space-y-3">
                    {q.answers && q.answers.map((answer, i) => (
                      <label key={i} className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl cursor-pointer hover:bg-purple-600/30 transition-all duration-300 border border-gray-600 hover:border-purple-500">
                        <input
                          type="radio"
                          name={`q${index}`}
                          value={answer.id}
                          onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[index] = e.target.value;
                            setAnswers(newAnswers);
                          }}
                          className="w-5 h-5 text-purple-500"
                        />
                        <span className="text-gray-200 font-medium">{answer.answer_text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={submitQuiz}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg font-bold text-lg"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-2xl shadow-2xl text-center border border-purple-500/20">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold mb-6 text-white">Quiz Complete!</h2>
              <div className="bg-purple-500/20 rounded-2xl p-8 mb-6">
                <p className="text-6xl font-bold text-green-400 mb-2">
                  {result.score}/{result.total}
                </p>
                <p className="text-gray-300 text-xl">
                  {Math.round((result.score / result.total) * 100)}% Correct
                </p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-semibold"
              >
                Try Another Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Movie Quizzes</h1>
          <p className="text-purple-300 text-lg">Test your movie knowledge and compete with others</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:scale-105 flex flex-col">
              <div className="mb-3">
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-sm text-purple-300">{quiz.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{quiz.title}</h3>
              <p className="text-gray-300 mb-4 flex-grow">
                Difficulty: <span className="font-semibold text-yellow-400">{quiz.difficulty}</span>
              </p>
              <button
                onClick={() => startQuiz(quiz.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-semibold"
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </div>
        {quizzes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 text-xl">No quizzes available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
