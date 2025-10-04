import { Stethoscope, Users, CalendarDays, FileText, Home, LogOut } from "lucide-react";
import React from "react";

export default function Sidebar({ setPage, currentPage, onLogout }) {
  // Get username from localStorage
  const username = localStorage.getItem("username") || "Guest";

  const menuItems = [
    { name: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { name: "doctors", label: "Doctors", icon: <Stethoscope className="w-5 h-5" /> },
    { name: "patients", label: "Patients", icon: <Users className="w-5 h-5" /> },
    { name: "appointments", label: "Appointments", icon: <CalendarDays className="w-5 h-5" /> },
    { name: "prescriptions", label: "Prescriptions", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 min-h-screen p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-6">Welcome, {username}</h2>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setPage(item.name)}
              className={`flex items-center gap-3 cursor-pointer p-2 rounded transition-colors
                ${currentPage === item.name ? "bg-gray-700 text-blue-400" : "hover:text-blue-400 hover:bg-gray-700"}`}
            >
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <button
          onClick={() => {
            localStorage.clear();
            onLogout();
          }}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 cursor-pointer w-full p-2 rounded transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
