import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard/quizzes">All Quizzes</Link></li>
            <li><Link to="/dashboard/create-quiz">Create Quiz</Link></li>
            <li><Link to="/dashboard/users">View Users</Link></li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <Outlet /> {/* Render nested routes */}
      </div>
    </div>
  );
};

export default Dashboard;
