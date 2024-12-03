import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const EditQuizModal = ({ show, onClose, onSuccess }) => {
  const { id } = useParams(); // Get the quiz ID from route params

  const [quizData, setQuizData] = useState({
    name: '',
    category: '',
    difficulty: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state

  // Helper to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  };

  // Fetch quiz details on component mount
  useEffect(() => {
    if (show) {
      const fetchQuizDetails = async () => {
        setLoading(true);
        try {
          const response = await API.get(`/admin/quizzes/${id}`);
          const data = response.data;
          setQuizData({
            name: data.name || '',
            category: data.category || '',
            difficulty: data.difficulty || '',
            startDate: formatDateForInput(data.startDate),
            endDate: formatDateForInput(data.endDate),
          });
        } catch (err) {
          console.error('Error fetching quiz:', err);
          setError('Failed to load quiz details. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuizDetails();
    }
  }, [id, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.put(`/admin/quizzes/${id}`, quizData); // Update quiz
      alert('Quiz updated successfully!');
      onSuccess(); // Callback to refresh data
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error updating quiz:', err.response?.data || err.message);
      setError('Failed to update quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null; // Do not render modal if `show` is false

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Edit Quiz</h2>
        {loading ? (
          <p>Loading quiz details...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="edit-quiz-form">
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Quiz'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditQuizModal;
