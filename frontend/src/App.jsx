import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Auth from "./components/Auth";
import LandingPage from "./pages/LandingPage";
import { UserProvider } from "./components/UserContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [page, setPage] = useState("landing"); // landing | auth

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedRole = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setRole(savedRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole("");
    setPage("landing");
  };

  const getDashboardUrl = () => {
    switch (role) {
      case "doctor":
        return "/doctors";
      case "patient":
        return "/patients";
      case "admin":
        return "/doctors";
      default:
        return "/home";
    }
  };

  if (isAuthenticated) {
    return (
      <UserProvider>
        <BrowserRouter>
          <Dashboard onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to={getDashboardUrl()} replace />} />
              <Route
                path="/home"
                element={<Home username={localStorage.getItem("username")} role={role} />}
              />
              <Route
                path="/doctors"
                element={<Doctors username={localStorage.getItem("username")} role={role} />}
              />
              <Route path="/patients" element={<Patients role={role} />} />
              <Route path="/appointments" element={<Appointments role={role} />} />
              <Route path="/prescriptions" element={<Prescriptions role={role} />} />
              <Route path="*" element={<Navigate to={getDashboardUrl()} replace />} />
            </Routes>
          </Dashboard>
        </BrowserRouter>
      </UserProvider>
    );
  }

  return page === "landing" ? (
    <LandingPage goToLogin={() => setPage("auth")} />
  ) : (
    <Auth setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
  );
}
