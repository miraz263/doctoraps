import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUser } from "./UserContext";

export default function Dashboard({ children, onLogout, username }) {
  // Get user from context if username prop is not provided
  const { user } = useUser();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-auto">
        {/* Navbar */}
        <Navbar onLogout={onLogout} username={username || user?.username || "User"} />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
