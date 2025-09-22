const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

// ------------------- REGISTER -------------------
router.post("/register", async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.json(result);
  } catch (err) {
    console.error("Register error:", err.message);
    if (err.message === "User already exists") {
      return res.status(409).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({ message: err.message });
  }
});

// ------------------- FORGOT PASSWORD -------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const result = await authService.forgotPassword(email);
    res.json(result);
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// ------------------- RESET PASSWORD -------------------
router.post("/reset-password", async (req, res) => {
  try {
    // const { token } = req.params;
    // const { newPassword } = req.body;

    const {token, newPassword} = req.body;


       if (!token) return res.status(400).json({ message: "Token required" });
    if (!newPassword) return res.status(400).json({ message: "New password required" });

    const result = await authService.resetPassword(token, newPassword);
    res.json(result);
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
