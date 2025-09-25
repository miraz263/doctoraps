import React from "react";

const stats = [
  { title: "Doctors", count: 12, bg: "bg-blue-600" },
  { title: "Patients", count: 34, bg: "bg-green-600" },
  { title: "Appointments", count: 20, bg: "bg-yellow-500" },
  { title: "Prescriptions", count: 15, bg: "bg-red-500" },
];

function StatCard({ title, count, bg }) {
  return (
    <div className={`${bg} text-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Doctor APS</h1>
      <p className="text-gray-600 mb-6">Manage your doctors, patients, appointments, and prescriptions.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} count={stat.count} bg={stat.bg} />
        ))}
      </div>
    </div>
  );
}
