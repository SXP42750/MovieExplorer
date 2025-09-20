import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Fill all fields");
    if (password.length < 6) return alert("Password must be >= 6 chars");
    if (password !== confirm) return alert("Passwords do not match");
    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, marginTop: 80 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
           autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={inputStyle}
           autoComplete="new-password"
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 6,
  border: "none",
  background: "#28a745",
  color: "#fff",
  cursor: "pointer",
};
