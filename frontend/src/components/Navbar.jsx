import React from "react";

export default function Navbar({ onLogout, username = "User" }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Welcome message */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Welcome, {username}
        </h1>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
