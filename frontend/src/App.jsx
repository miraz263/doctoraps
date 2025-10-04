import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Login from "./pages/Login"; // ✅

export default function App() {
  const [page, setPage] = useState("login"); // start at login

  const renderPage = () => {
    switch (page) {
      case "login": return <Login setPage={setPage} />;
      case "home": return <Home />;
      case "doctors": return <Doctors />;
      case "patients": return <Patients />;
      case "appointments": return <Appointments />;
      case "prescriptions": return <Prescriptions />;
      default: return <Home />;
    }
  };

  return page === "login"
    ? renderPage()
    : <Dashboard setPage={setPage}>{renderPage()}</Dashboard>;
}
