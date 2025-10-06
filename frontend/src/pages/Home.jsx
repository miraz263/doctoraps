import React, { useEffect, useState } from "react";

export default function Home({ username, role }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set a greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {greeting}, {username || "User"}!
      </h1>

      <p className="mb-4">
        Welcome to your dashboard. Here you can see your summary and quick links.
      </p>

      {/* Role-based content */}
      {role === "admin" && (
        <div className="border p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Admin Panel</h2>
          <ul className="list-disc list-inside">
            <li>Manage Doctors</li>
            <li>Manage Patients</li>
            <li>View Appointments</li>
          </ul>
        </div>
      )}

      {role === "doctor" && (
        <div className="border p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Doctor Panel</h2>
          <ul className="list-disc list-inside">
            <li>View Your Patients</li>
            <li>Manage Appointments</li>
            <li>Prescribe Medications</li>
          </ul>
        </div>
      )}

      {role === "patient" && (
        <div className="border p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Patient Panel</h2>
          <ul className="list-disc list-inside">
            <li>View Your Appointments</li>
            <li>See Prescriptions</li>
            <li>Contact Doctors</li>
          </ul>
        </div>
      )}

      {role === "agent" && (
        <div className="border p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Agent Panel</h2>
          <p>Manage your assigned patients or properties here.</p>
        </div>
      )}
    </div>
  );
}
