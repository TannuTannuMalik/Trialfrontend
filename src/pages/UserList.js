import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all users from the backend
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8080/api/users') // Use the specified endpoint
      .then((response) => {
        setUsers(response.data); // Set user data
        setLoading(false); // Turn off loading
      })
      .catch((error) => {
        console.error('Error fetching users:', error.response || error.message);
        setError('Failed to load users. Please try again.');
        setLoading(false); // Turn off loading
      });
  }, []);

  if (loading) {
    return <p>Loading users...</p>; // Show loading message
  }

  if (error) {
    return <p className="error">{error}</p>; // Show error message
  }

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.role || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
};

export default UserList;
