
// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import AdminDashboard from "./pages/AdminDashboard";
// import { ThemeProvider } from "./context/ThemeContext";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import PrivateAdminRoute from "./routes/PrivateAdminRoute";
// import { useAuth } from "./context/AuthContext";

// export default function App() {
//   const { isAdmin, loading } = useAuth();

//   // Filters state
//   const [filters, setFilters] = useState({
//     query: "",
//     genreId: "",
//     language: "",
//     rating: "",
//     sortBy: ""
//   });

//   if (loading) return <p>Loading...</p>;

//   return (
//     <ThemeProvider>
//       <Router>
//         {/* Navbar passes filter updates */}
//         <Navbar onFilterChange={setFilters} />

//         <Routes>
//           <Route
//             path="/"
//             element={
//               <div style={{ paddingTop: "100px" }}>
//                 {isAdmin ? <AdminDashboard /> : <Home {...filters} />}
//               </div>
//             }
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/admin"
//             element={
//               <div style={{ paddingTop: "100px" }}>
//                 <PrivateAdminRoute>
//                   <AdminDashboard />
//                 </PrivateAdminRoute>
//               </div>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateAdminRoute from "./routes/PrivateAdminRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAdmin, loading } = useAuth();

  // Filters state
  const [filters, setFilters] = useState({
    query: "",
    genreId: "",
    language: "",
    rating: "",
    sortBy: ""
  });

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeProvider>
      <Router>
        {/* Navbar passes filter updates */}
        <Navbar onFilterChange={setFilters} />

        <Routes>
          <Route
            path="/"
            element={
              <div style={{ paddingTop: "100px" }}>
                {isAdmin ? <AdminDashboard /> : <Home {...filters} />}
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Added password reset routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admin"
            element={
              <div style={{ paddingTop: "100px" }}>
                <PrivateAdminRoute>
                  <AdminDashboard />
                </PrivateAdminRoute>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
