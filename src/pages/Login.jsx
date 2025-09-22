import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("app-theme") ||
        (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    
    document.body.setAttribute("data-theme", theme);
    try { localStorage.setItem("app-theme", theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email & password");

    try {
      setLoading(true);
      await loginWithEmail(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Login failed");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="theme-toggle-wrapper">
        <button
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-text">
          Don't have an account? <Link to="/register" className="login-link">Register here</Link>
        </p>

        <p className="login-text">
          <Link to="/forgot-password" className="login-link">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}
