import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // ✅ Prevents flashing before auth state loads
  }

  if (!user || !role) {
    return <Navigate to="/login" replace />; // ✅ Redirects if not logged in
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}-dashboard`} replace />; // ✅ Redirects to the correct dashboard
  }

  return children ? children : <Outlet />; // ✅ Ensures child components render
};

export default ProtectedRoute;
