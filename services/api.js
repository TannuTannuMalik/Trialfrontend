import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/quizzes', // Base URL of your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
