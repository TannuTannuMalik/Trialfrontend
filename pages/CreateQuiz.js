import React, { useState } from "react";
import API from "../services/api";

const CreateQuiz = ({ onQuizCreated }) => {
  const [quiz, setQuiz] = useState({
    name: "",
    category: "",
    difficulty: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({ ...prevQuiz, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add amount as 11 when submitting
    const quizWithActualAmount = { ...quiz, amount: 11 };

    API.post("/create", quizWithActualAmount)
      .then((response) => {
        alert("Quiz created successfully!");
        onQuizCreated(response.data);
      })
      .catch((error) => {
        console.error("Error creating quiz:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Quiz</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={quiz.name}
          onChange={handleInputChange}
          required
        />
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
        <select
          name="difficulty"
          value={quiz.difficulty}
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
        Amount:
        {/* Display 10 for admin, but actually send 11 */}
        <input type="number" value={10} disabled />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          name="startDate"
          value={quiz.startDate}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
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
