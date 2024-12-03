import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlayQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:300/api/quizzes/play/${quizId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to load quiz: ${response.status}`);
        }

        const data = await response.json();
        setQuiz(data.quiz);
        setQuestion(data.question);
        setTotalQuestions(data.totalQuestions);
      } catch (error) {
        console.error("Error fetching quiz:", error.message);
        setError("Could not connect to the backend. Please try again later.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const answer = formData.get("answer")?.trim();

    try {
      const response = await fetch(
        `http://localhost:300/api/quizzes/play/${quizId}/question/${currentQuestionIndex}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Failed to submit answer.");
        return;
      }

      const data = await response.json();
      setFeedbackMessage(data.feedbackMessage);
      setIsCorrect(data.isCorrect);
      setAnswerSubmitted(true);
    } catch (error) {
      console.error("Error submitting answer:", error.message);
    }
  };

  const handleNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < totalQuestions) {
      try {
        const response = await fetch(
          `http://localhost:300/api/quizzes/play/${quizId}/question/${nextIndex}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load question ${nextIndex}: ${response.status}`);
        }

        const data = await response.json();
        setQuestion(data.question);
        setCurrentQuestionIndex(nextIndex);
        setFeedbackMessage("");
        setAnswerSubmitted(false);
        setIsCorrect(null);
      } catch (error) {
        console.error("Error loading next question:", error.message);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:300/api/quizzes/play/${quizId}/complete`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz completion data.");
        }

        const data = await response.json();
        navigate(`/quizComplete`, {
          state: {
            finalScore: data.finalScore,
            totalQuestions: data.totalQuestions,
            feedbackList: data.feedbackList,
            quizId,
          },
        });
      } catch (error) {
        console.error("Error completing quiz:", error.message);
      }
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!quiz || !question) return <p>Loading...</p>;

  return (
    <div className="quiz-container">
      <h1>{quiz.name}</h1>
      <p>Question {currentQuestionIndex + 1} of {totalQuestions}</p>

      <form onSubmit={handleSubmit}>
        <p>{question.text}</p>
        <ul>
          {question.options?.map((option, index) => (
            <li key={index}>
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                value={option.optionText}
                required
                disabled={answerSubmitted}
              />
              <label htmlFor={`option-${index}`}>{option.optionText}</label>
            </li>
          ))}
        </ul>
        {!answerSubmitted && (
          <button type="submit">Submit Answer</button>
        )}
      </form>

      {feedbackMessage && (
        <div>
          <p className={isCorrect ? "text-green-500" : "text-red-500"}>{feedbackMessage}</p>
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex + 1 < totalQuestions ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayQuiz;
