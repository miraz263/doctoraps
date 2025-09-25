import { Menu } from "lucide-react";
import React from "react";

export default function Navbar({ currentPage, setPage, onLogout }) {
  // Get username from localStorage
  const username = localStorage.getItem("username") || "Guest";

  const navItems = [
    { name: "dashboard", label: "Dashboard" },
    { name: "profile", label: "Profile" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Menu className="w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors" />
        <span className="font-bold text-2xl tracking-wide">Doctor APS</span>
      </div>

      <div className="flex items-center gap-4">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setPage(item.name)}
            className={`px-3 py-1 rounded transition-colors ${
              currentPage === item.name ? "bg-gray-700 text-blue-400" : "hover:text-blue-400 hover:bg-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}

        <span className="px-3 py-1 rounded bg-gray-700 text-gray-200">{username}</span>

        <button
          onClick={() => {
            localStorage.clear();
            onLogout();
          }}
          className="px-3 py-1 rounded text-red-400 hover:text-red-500 hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
