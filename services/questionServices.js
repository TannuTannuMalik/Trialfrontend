import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/questions',
});

export const getQuestionsByQuizId = async (quizId) => {
  const response = await axios.get(`/quiz/${quizId}`);
  return response.data;
};

export default API;
