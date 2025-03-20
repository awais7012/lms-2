import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // Ensure this path is correct
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<AdminDashboard />} />
        {/* Add other routes here if needed */}
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
