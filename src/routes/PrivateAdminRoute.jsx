import React from "react";
import { Navigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const PrivateAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  console.log("ROUTE CHECK:", user?.email, "isAdmin:", isAdmin); 


  if (loading) return <div>Loading...</div>; 

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
   
};

export default PrivateAdminRoute;
