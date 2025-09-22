import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Enter your email");

    try {
      const res = await requestPasswordReset(email);
      setMessage(res.message || "Check your email for reset link");
      if (res.previewUrl) setPreviewUrl(res.previewUrl); // Ethereal preview
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div style={{ padding: 20, marginTop: 80 }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
      {previewUrl && (
        <p>
          <strong>Preview URL (Dev only):</strong> <a href={previewUrl} target="_blank" rel="noreferrer">Open Email</a>
        </p>
      )}
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
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
};
