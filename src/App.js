import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import PrivateAdminRoute from "./routes/PrivateAdminRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={isAdmin ? <AdminDashboard /> : <Home />}
          />


          <Route path="/login" element={<Login />} />


          <Route
            path="/admin"
            element={

              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
