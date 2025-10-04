import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Doctor APS</h2>

      <button
        type="button"
        className="mb-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => navigate("/home")}
      >
        Home
      </button>

      <button
        type="button"
        className="mb-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => navigate("/doctors")}
      >
        Doctors
      </button>

      <button
        type="button"
        className="mb-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => navigate("/patients")}
      >
        Patients
      </button>

      <button
        type="button"
        className="mb-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => navigate("/appointments")}
      >
        Appointments
      </button>

      <button
        type="button"
        className="mb-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => navigate("/prescriptions")}
      >
        Prescriptions
      </button>
    </div>
  );
}
