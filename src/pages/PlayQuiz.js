import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import { Axios } from 'axios';
const StartQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { quizId } = useParams();
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const startQuiz = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.post(
                    `http://localhost:8080/api/tournaments/${quizId}/start?playerId=${userId}`,
                    { playerId: userId }
                );

                if (response.data) {
                    setQuestions(response.data);
                }
            } catch (err) {
                setError('You have already played this quiz!!!');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        startQuiz();
    }, [quizId, userId, navigate]);

    const handleOptionChange = (questionId, option) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: option,
        }));
    };

    const allqizzes = (quizId) => {
        navigate(`/quizzes`); // Redirect to the quiz edit page
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const response = await axios.post(
                `http://localhost:8080/api/tournaments/${quizId}/user/${userId}/submit`,
                answers // Directly pass answers object
            );

            if (response.data) {
                setFeedback(response.data); // Store feedback, score, and correct answers
            }
        } catch (err) {
            setError('Failed to submit the quiz');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Start Quiz</h2>
            {!feedback ? (
                <form onSubmit={handleSubmit}>
                    {questions.map((question) => (
                        <div key={question.id} className="question">
                            <h3>{question.questionText}</h3>
                            {question.options.map((option, index) => (
                                <div key={index} className="option">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={() => handleOptionChange(question.id, option)}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <h3>Quiz Feedback</h3>
                    <p>{feedback.feedback}</p>
                    <p>Score: {feedback.score}</p>
                    <p>Correct Answers: {feedback.correctAnswers}</p>
                </div>
            )}
        </div>
    );
};

export default StartQuiz;
