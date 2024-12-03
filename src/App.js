import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QuizList from './QuizStatics/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import UserList from './pages/UserList';
import QuizQuestion from './pages/QuizQuestion';
import PlayQuiz from './pages/PlayQuiz'
import SideBar from './components/SideBar'; // Sidebar for navigation
import NotFound from './pages/NotFound'; // Custom Not Found Page
import './styles/App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthProvider from './services/AuthContext';
import PlayerDashboard from './pages/PlayerDashboard';
import ViewQuizzes from './pages/ViewQuizzes';

function App() {
  const [quizzes, setQuizzes] = useState([]);

  return (
    <AuthProvider>
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <SideBar />
        {/* Main Content */}
        <div className="main-content">
          <Routes>
            {/* Welcome Route */}
            <Route path="/" element={<h1>Welcome to the Quiz App</h1>} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              {/* Nested Routes under Dashboard */}
              <Route path="quizzes" element={<QuizList quizzes={quizzes} setQuizzes={setQuizzes} />} />
              <Route path="create-quiz" element={<CreateQuiz setQuizzes={setQuizzes} />} />
              <Route path="edit-quiz/:id" element={<EditQuiz quizzes={quizzes} setQuizzes={setQuizzes} />} />
              <Route path="users" element={<UserList />} />
            </Route>

            <Route path="/player-dashboard" element={<PlayerDashboard />}>
              {/* Quiz Routes */}
              <Route path="quizzes" element={<ViewQuizzes />} />
              <Route path="quiz/:quizId" element={<QuizQuestion />} />
              <Route path=":quizId/play" element={<PlayQuiz />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
