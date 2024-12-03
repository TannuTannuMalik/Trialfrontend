// components/SideBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2>Quiz App</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/quizzes">Quizzes</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/create-quiz">Create Quiz</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/users">Users</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
