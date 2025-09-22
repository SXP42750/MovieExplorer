import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) return alert("Enter all fields");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    if (!token) return alert("Invalid token");

    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message || "Password reset successful");
      if (res.previewUrl) setPreviewUrl(res.previewUrl); 
      setTimeout(() => navigate("/login"), 2000); 
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={{ padding: 20, marginTop: 80 }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Reset Password</button>
      </form>

      {message && <p>{message}</p>}
      {previewUrl && (
        <p>
          <strong>Preview URL (Dev only):</strong>{" "}
          <a href={previewUrl} target="_blank" rel="noreferrer">Open Email</a>
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
  background: "#28a745",
  color: "#fff",
  cursor: "pointer",
};
