import React, { useState, useEffect } from 'react';
import API from '../services/api';

const QuizCategoryList = ({ endpoint, title }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    API.get(endpoint)
      .then((response) => setQuizzes(response.data))
      .catch((error) => console.error(`Error fetching ${title}:`, error));
  }, [endpoint, title]);

  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>{quiz.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuizCategoryList;
