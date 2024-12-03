import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QuizList from './QuizStatics/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import UserList from './pages/UserList';
import QuizQuestions from './pages/QuizQuestions';
import PlayQuiz from './pages/PlayQuiz'
import SideBar from './components/SideBar'; // Sidebar for navigation
import NotFound from './pages/NotFound'; // Custom Not Found Page
import './styles/App.css';

function App() {
  const [quizzes, setQuizzes] = useState([]);

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <SideBar />
        {/* Main Content */}
        <div className="main-content">
          <Routes>
            {/* Welcome Route */}
            <Route path="/" element={<h1>Welcome to the Quiz App</h1>} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              {/* Nested Routes under Dashboard */}
              <Route path="quizzes" element={<QuizList quizzes={quizzes} setQuizzes={setQuizzes} />} />
              <Route path="create-quiz" element={<CreateQuiz setQuizzes={setQuizzes} />} />
              <Route path="edit-quiz/:id" element={<EditQuiz quizzes={quizzes} setQuizzes={setQuizzes} />} />
              <Route path="users" element={<UserList />} />
              <Route path="/dashboard/quizzes/:quizId" element={<QuizQuestions />} />
            </Route>

            {/* Quiz Routes */}
            <Route path="/quiz/:quizId" element={<QuizQuestions />} />
            <Route path="/play/:quizId" element={<PlayQuiz />} />
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
