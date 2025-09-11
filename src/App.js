import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import PrivateAdminRoute from "./routes/PrivateAdminRoute"; //admin only route protection
import { useAuth } from "./context/AuthContext"; // import auth
import "./index.css";

export default function App() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait until Firebase resolves

  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Root route behaves differently for Admin vs User */}
          <Route
            path="/"
            element={isAdmin ? <AdminDashboard /> : <Home />}  // root route for admin and user
          />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Admin protected route */}
          <Route
            path="/admin" // show admin dashboard only if admin is true
            element={

              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />

          {/* Fallback: if route not found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
