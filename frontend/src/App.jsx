import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Auth from "./components/Auth"; // Make sure path is correct

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(""); // Logged-in user role

  // -------------------------
  // Check authentication on load
  // -------------------------
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedRole = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setRole(savedRole || "");
    }
  }, []);

  // -------------------------
  // Logout handler
  // -------------------------
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole("");
  };

  // -------------------------
  // Role-based dashboard URL
  // -------------------------
  const getDashboardUrl = () => {
    const url = localStorage.getItem("dashboard_url");
    if (url) return url;

    switch (role) {
      case "doctor":
        return "/doctors";
      case "patient":
        return "/patients";
      case "agent":
      case "management":
      case "admin":
        return "/home";
      default:
        return "/home";
    }
  };

  // -------------------------
  // Show login/register if not authenticated
  // -------------------------
  if (!isAuthenticated) {
    return <Auth setIsAuthenticated={setIsAuthenticated} setRole={setRole} />;
  }

  // -------------------------
  // Render authenticated app with dashboard
  // -------------------------
  return (
    <BrowserRouter>
      <Dashboard setIsAuthenticated={setIsAuthenticated} onLogout={handleLogout}>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Navigate to={getDashboardUrl()} replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/prescriptions" element={<Prescriptions />} />

          {/* Role-based dashboard redirect */}
          <Route path="/dashboard" element={<Navigate to={getDashboardUrl()} replace />} />

          {/* Catch-all unknown routes */}
          <Route path="*" element={<Navigate to={getDashboardUrl()} replace />} />
        </Routes>
      </Dashboard>
    </BrowserRouter>
  );
}
