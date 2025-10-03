import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Login from "./pages/Login";

export default function App() {
  const [page, setPage] = useState("login"); // start at login

  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login setPage={setPage} />;
      case "home":
        return <Home />;
      case "doctors":
        return <Doctors />;
      case "patients":
        return <Patients />;
      case "appointments":
        return <Appointments />;
      case "prescriptions":
        return <Prescriptions />;
      default:
        return <Home />;
    }
  };

  // Get dashboard_url from localStorage after login
  const dashboardUrl = localStorage.getItem("dashboard_url") || "/home";

  return page === "login" ? (
    renderPage()
  ) : (
    <BrowserRouter>
      <Dashboard setPage={setPage}>
        <Routes>
          {/* Main app pages */}
          <Route path="/" element={renderPage()} />
          <Route path="/home" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/prescriptions" element={<Prescriptions />} />

          {/* Role-based redirect */}
          <Route path="/dashboard" element={<Navigate to={dashboardUrl} replace />} />

          {/* Redirect unknown routes to dashboard/home */}
          <Route path="*" element={<Navigate to={dashboardUrl} replace />} />
        </Routes>
      </Dashboard>
    </BrowserRouter>
  );
}
