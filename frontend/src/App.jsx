import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Auth from "./components/Auth"; // Login/Register component
import LandingPage from "./pages/LandingPage"; // New landing page
import { UserProvider } from "./components/UserContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [page, setPage] = useState("landing"); // landing | auth

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
    setPage("landing"); // redirect to landing page after logout
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
  // Show authenticated app with dashboard
  // -------------------------
  if (isAuthenticated) {
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

  // -------------------------
  // Show landing or login/register for unauthenticated users
  // -------------------------
  return page === "landing" ? (
    <LandingPage goToLogin={() => setPage("auth")} />
  ) : (
    <Auth setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
  );
}
