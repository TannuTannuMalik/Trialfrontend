import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import API from '../services/api'; 

const ViewQuizzes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ongoingQuizzes, setOngoingQuizzes] = useState([]);
  const [participatedQuizzes, setParticipatedQuizzes] = useState([]);
  
  // Fetch ongoing quizzes and participated quizzes when the component loads
  useEffect(() => {
      fetchOngoingQuizzes();
      fetchParticipatedQuizzes();  
    
  }, [navigate]);

  // Fetch ongoing quizzes
  const fetchOngoingQuizzes = async () => {
    try {
      const { data } = await API.get('/ongoing'); // Fetch ongoing quizzes from API
      setOngoingQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // Fetch quizzes the player has participated in
  const fetchParticipatedQuizzes = async () => {
    try {
      const { data } = await API.get(`/participated?userId=${user.id}`); // Use user ID from context
      setParticipatedQuizzes(data);  
    } catch (error) {
      console.error('Error fetching participated quizzes:', error);
    }
  };

  // Check if the player has participated in the quiz
  const hasParticipatedInQuiz = (quizId) => {
    return participatedQuizzes.some((quiz) => quiz.id === quizId);
  };

  // Handle quiz join action
  const handleJoinQuiz = (quizId) => {
    if (!hasParticipatedInQuiz(quizId)) {
      navigate(`/player-dashboard/${quizId}/play`);
    } else {
      alert('You have already participated in this quiz!');
    }
  };

  return (
    <div>
      <h1>Welcome to the Player Page</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ongoingQuizzes.map((quiz) => (
            <tr key={quiz.id}>
                <td>{quiz.id}</td>
              <td>{quiz.name}</td>
              <td>{quiz.category}</td>
              <td>{quiz.difficulty}</td>
              <td>
                <button
                  variant={hasParticipatedInQuiz(quiz.id) ? 'secondary' : 'primary'}
                  onClick={() => handleJoinQuiz(quiz.id)}
                  disabled={hasParticipatedInQuiz(quiz.id)}
                >
                  {hasParticipatedInQuiz(quiz.id) ? 'Already Participated' : 'Join'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ViewQuizzes;
