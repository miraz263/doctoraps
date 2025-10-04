import React from "react";

export default function Navbar({ onLogout }) {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <button
        type="button"
        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}
