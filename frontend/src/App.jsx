import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Auth from "./components/Auth"; // Login/Register component
import { UserProvider } from "./components/UserContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

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
    switch (role) {
      case "doctor":
        return "/doctors";
      case "patient":
        return "/patients";
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
    <UserProvider>
      <BrowserRouter>
        <Dashboard onLogout={handleLogout}>
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to={getDashboardUrl()} replace />} />

            {/* Main pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/prescriptions" element={<Prescriptions />} />

            {/* Catch-all unknown routes */}
            <Route path="*" element={<Navigate to={getDashboardUrl()} replace />} />
          </Routes>
        </Dashboard>
      </BrowserRouter>
    </UserProvider>
  );
}
