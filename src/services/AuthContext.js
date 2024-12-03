import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { data } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
//login
  const login = async (credentials) => {
    try {
      // Pass the username and password in the request body
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        credentials, // Send credentials object { username, password }
        {
          headers: {
            "Content-Type": "application/json", // Specify the request body content type
          },
        }
      );

      // Assuming the backend responds with userId and role
      const { userId, role } = data;

      if (userId && role) {
        // Store userId and role in localStorage
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
  
        // Update the context user state
        setUser({ userId, role });
      } else {
        throw new Error("Invalid login response: userId or role missing.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };
//register
 // Register function
 const register = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      formData, // Pass { username, email, password }
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Registration successful:", response.data);
    return response.data.user.role;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};
//logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user")); // Assume user info is stored
    if (token && storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
