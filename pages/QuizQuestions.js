import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionsByQuizId } from '../services/questionServices';

const QuizQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestionsByQuizId(quizId);
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err.message || err.response);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h2>Questions for Quiz ID: {quizId}</h2>
      {questions.length > 0 ? (
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              <h4>Question: {question.text}</h4>
              <p>Correct Answer: {question.correctAnswer}</p>
              <p>Incorrect Answers: {question.incorrectAnswers.join(', ')}</p>
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
