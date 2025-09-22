const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function registerUser({ name, email, password }) {
  if (!name || !email || !password) throw new Error("Missing fields");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    isAdmin,
  });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  };
}

async function loginUser({ email, password }) {
  if (!email || !password) throw new Error("Missing fields");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  };
}

async function forgotPassword(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  
  const resetUrl = `${process.env.CLIENT_URL.replace(/\/$/, "")}/reset-password/${resetToken}`;

  let transporter;
  let isEthereal = false;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    isEthereal = true;
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER || "no-reply@example.com",
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below (valid for 15 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  let previewUrl = null;
  if (isEthereal) previewUrl = nodemailer.getTestMessageUrl(info);

  return { message: "Password reset link sent to email", previewUrl };
}

async function resetPassword(token, newPassword) {
  if (!token) throw new Error("Token required");
  if (!newPassword) throw new Error("New password required");

  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Password reset successful" };
}

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
