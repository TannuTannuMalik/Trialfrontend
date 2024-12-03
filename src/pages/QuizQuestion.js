import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuizQuestions = ({ quizId }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/questions/quiz/${quizId}`)
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      });
  }, [quizId]);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="quiz-questions-container">
      <h2>Questions for Quiz ID: {quizId}</h2>
      {questions.length > 0 ? (
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              <h4>{question.text}</h4>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
              <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available for this quiz.</p>
      )}
    </div>
  );
};

export default QuizQuestions;
