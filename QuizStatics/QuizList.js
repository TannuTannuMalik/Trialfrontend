import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const QuizList = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [quizzes, setQuizzes] = useState([]); // State for quizzes
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [currentQuiz, setCurrentQuiz] = useState(null); // Current quiz being edited
  const [formData, setFormData] = useState({
    creator: "",
    name: "",
    category: "",
    difficulty: "",
  }); // Form state

  // Function to convert UTC time to local time
  const convertUTCToLocal = (utcDateString) => {
    if (!utcDateString) return "N/A";
    const localDate = new Date(utcDateString);
    return localDate.toLocaleString(); // Convert to local time string
  };

  useEffect(() => {
    setLoading(true);
    API.get("/all") // Endpoint to fetch quizzes
      .then((response) => {
        const data = response.data.map((quiz) => ({
          ...quiz,
          startDate: convertUTCToLocal(quiz.startDate),
          endDate: convertUTCToLocal(quiz.endDate),
        }));
        setQuizzes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load quizzes. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (confirmDelete) {
      try {
        await API.delete(`/${quizId}`);
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.id !== quizId)
        );
        alert("Quiz deleted successfully.");
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  const handleEditClick = (quiz) => {
    setCurrentQuiz(quiz);
    setFormData({
      creator: quiz.creator || "",
      name: quiz.name || "",
      category: quiz.category || "",
      difficulty: quiz.difficulty || "",
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/quizzes/${currentQuiz.id}`, formData);
      alert("Quiz updated successfully!");
      // Update the quiz list with the new data
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === currentQuiz.id ? { ...quiz, ...formData } : quiz
        )
      );
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error updating quiz:", error.response?.data || error.message);
      alert("Failed to update quiz. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentQuiz(null);
    setFormData({
      creator: "",
      name: "",
      category: "",
      difficulty: "",
    });
  };

  const currentDate = new Date();

  // Categorize quizzes
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

  const renderTable = (quizList, title, showPlayButton = false, showEditButton = false) => (
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizList.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.id}</td>
                <td>
                  <Link to={`/dashboard/quizzes/${quiz.id}`}>{quiz.name}</Link>
                </td>
                <td>{quiz.category || "N/A"}</td>
                <td>{quiz.difficulty || "N/A"}</td>
                <td>{quiz.startDate}</td>
                <td>{quiz.endDate}</td>
                <td>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  {showPlayButton && (
                    <Link to={`/play/${quiz.id}`} className="play-button">
                      Play
                    </Link>
                  )}
                  {showEditButton && (
                    <button
                      onClick={() => handleEditClick(quiz)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  )}
                </td>
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
      {renderTable(ongoingQuizzes, "Ongoing Quizzes", true, true)}
      {renderTable(upcomingQuizzes, "Upcoming Quizzes", false, true)}
      {renderTable(pastQuizzes, "Past Quizzes", false, false)}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Quiz</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Creator:
                <input
                  type="text"
                  name="creator"
                  value={formData.creator}
                  onChange={(e) =>
                    setFormData({ ...formData, creator: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Difficulty:
                <input
                  type="text"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  required
                />
              </label>
              <button type="submit">Update Quiz</button>
              <button type="button" onClick={handleModalClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
