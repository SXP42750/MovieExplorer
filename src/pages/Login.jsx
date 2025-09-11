import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const { loginWithGoogle, loginWithEmail, user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔹 Redirect after login state changes
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) navigate("/admin");
      else navigate("/");
    }
  }, [user, isAdmin, loading, navigate]); // when the user or loading state changes the useeffect will run

  
  const handleUserGoogleLogin = async () => {
    try {
      await loginWithGoogle(); // waits until the login is complete
    } catch (err) {
      console.error("User Google login error:", err); // log the error for debugging
      alert(err.message || "Login failed");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      console.error("Email login error:", err);
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>; // 🔹 wait until auth loads

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <h2>Login</h2>

     
      <h3>User Login</h3>
      <button
        onClick={handleUserGoogleLogin}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      >
        Login with Google
      </button>

      <hr />

      <h3>Admin Login</h3>
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Login with Email
        </button>
      </form>
    </div>
  );
}
