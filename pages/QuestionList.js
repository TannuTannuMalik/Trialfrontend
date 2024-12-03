import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const QuizList = ({ quizzes, setQuizzes }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get('/api/quizzes') // Adjust the endpoint based on your API
      .then((response) => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
        setLoading(false);
      });
  }, [setQuizzes]);

  const currentDate = new Date();

  const ongoingQuizzes = quizzes.filter(
    (quiz) =>
      new Date(quiz.startDate) <= currentDate && new Date(quiz.endDate) >= currentDate
  );

  const upcomingQuizzes = quizzes.filter(
    (quiz) => new Date(quiz.startDate) > currentDate
  );

  const pastQuizzes = quizzes.filter(
    (quiz) => new Date(quiz.endDate) < currentDate
  );

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const renderTable = (quizList, title, showPlayButton = false) => (
    <section className="quiz-section">
      <h3>{title}</h3>
      {quizList.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Start Date</th>
              <th>End Date</th>
              {showPlayButton && <th>Play</th>}
            </tr>
          </thead>
          <tbody>
            {quizList.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.id}</td>
                <td>{quiz.name}</td>
                <td>{quiz.category || 'N/A'}</td>
                <td>{quiz.difficulty || 'N/A'}</td>
                <td>{quiz.startDate ? new Date(quiz.startDate).toLocaleString() : 'N/A'}</td>
                <td>{quiz.endDate ? new Date(quiz.endDate).toLocaleString() : 'N/A'}</td>
                {showPlayButton && (
                  <td>
                    <Link to={`/play/${quiz.id}`} className="play-button">
                      Play
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No {title.toLowerCase()} available.</p>
      )}
    </section>
  );

  return (
    <div className="quiz-list-container">
      <h2>Quiz List</h2>
      {renderTable(ongoingQuizzes, 'Ongoing Quizzes', true)}
      {renderTable(upcomingQuizzes, 'Upcoming Quizzes')}
      {renderTable(pastQuizzes, 'Past Quizzes')}
    </div>
  );
};

export default QuizList;
