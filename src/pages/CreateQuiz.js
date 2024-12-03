import React, { useState } from 'react';
import API from '../services/api';


const CreateQuiz = ({ onQuizCreated }) => {
  const [quiz, setQuiz] = useState({
    name: '',
    category: '',
    difficulty: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({ ...prevQuiz, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/create', quiz)
      .then((response) => {
        alert('Quiz created successfully!');
        onQuizCreated(response.data);
      })
      .catch((error) => {
        console.error('Error creating quiz:', error);
        alert('Failed to create quiz.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Quiz</h2>
      <label>
        Name:
        <input type="text" name="name" value={quiz.name} onChange={handleInputChange} required />
      </label>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={quiz.category}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Difficulty:
        <select name="difficulty" value={quiz.difficulty} onChange={handleInputChange} required>
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
          value={quiz.startDate}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="datetime-local"
          name="endDate"
          value={quiz.endDate}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Create Quiz</button>
    </form>
  );
};

export default CreateQuiz;
