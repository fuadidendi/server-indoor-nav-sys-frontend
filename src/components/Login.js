import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file for styling

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  // Hardcoded credentials
  const hardcodedUsername = "admin";
  const hardcodedPassword = "12345";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Login Form */}
      <div className="login-form">
      <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Sign In
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {/* <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password</a>
          </div> */}
        </form>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="login-welcome">
        <h2>Welcome to Indoor Navigation System</h2>
        <p>Don't have an account?</p>
        <button className="btn-signup">Sign Up</button>
      </div>

      {/* Footer Section */}
      <footer className="login-footer">
        &copy; {new Date().getFullYear()} Indoor Navigation System. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
