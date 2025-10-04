import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Dashboard({ children, onLogout }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-auto">
        {/* Navbar */}
        <Navbar onLogout={onLogout} />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
