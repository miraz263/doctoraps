import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    prescriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/stats/");
        console.log("API Response:", response.data); // Debug
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Doctor APS(Appointment and Prescription System)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h2>Doctors</h2>
          <p className="text-3xl font-bold">{stats.doctors}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
          <h2>Patients</h2>
          <p className="text-3xl font-bold">{stats.patients}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
          <h2>Appointments</h2>
          <p className="text-3xl font-bold">{stats.appointments}</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
          <h2>Prescriptions</h2>
          <p className="text-3xl font-bold">{stats.prescriptions}</p>
        </div>
      </div>
    </div>
  );
}
