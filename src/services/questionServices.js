import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const fetchQuestionsByQuizId = async (quizId) => {
  try {
    const response = await API.get(`/questions/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions by quiz ID:', error);
    throw error;
  }
};

export default API;
