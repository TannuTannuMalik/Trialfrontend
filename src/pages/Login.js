import React, { useState, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Form.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({username, password});

      const role = localStorage.getItem("role");
      if (role) {
        setMessage("Login successful!");
        setTimeout(() => {
          if (role === "ADMIN") {
            navigate("/dashboard");
          } else if (role === "USER") {
            navigate("/player-dashboard");
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        setMessage("Login failed: Role not found.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="form-input">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
        <button type="submit">Login</button>
        <br/>
        Don't have an account?{" "}
        <Link to="/register" className="btn register-link">
            Register here
        </Link>
      </form>
    </div>
  );
};

export default Login;
