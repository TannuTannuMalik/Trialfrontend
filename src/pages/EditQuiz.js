import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const EditQuiz = () => {
  const { id } = useParams(); // Quiz ID from route params
  const navigate = useNavigate(); // For navigation

  const [quizData, setQuizData] = useState({
    name: '',
    category: '',
    difficulty: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  };

  // Fetch quiz details from the backend
  useEffect(() => {
    setLoading(true);
    API.get(`/admin/quizzes/${id}`) // Fetch quiz by ID
      .then((response) => {
        const data = response.data;
        setQuizData({
          name: data.name || '',
          category: data.category || '',
          difficulty: data.difficulty || '',
          startDate: formatDateForInput(data.startDate),
          endDate: formatDateForInput(data.endDate),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz details. Please try again.');
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Submitting updated quiz data:', quizData);

    API.put(`/admin/quizzes/${id}`, quizData) // Update quiz
      .then(() => {
        alert('Quiz updated successfully!');
        navigate('/dashboard/quizzes'); // Redirect to quizzes list
      })
      .catch((error) => {
        console.error('Error updating quiz:', error.response?.data || error.message);
        setError('Failed to update quiz. Please try again.');
      });
  };

  if (loading) return <p>Loading quiz details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={quizData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={quizData.category}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Difficulty:
          <select
            name="difficulty"
            value={quizData.difficulty}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="datetime-local"
            name="startDate"
            value={quizData.startDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            name="endDate"
            value={quizData.endDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Update Quiz</button>
      </form>
    </div>
  );
};

export default EditQuiz;
