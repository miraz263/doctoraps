import { Stethoscope, Users, CalendarDays, FileText, Home, LogOut } from "lucide-react";

export default function Sidebar({ setPage, onLogout }) {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 min-h-screen p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-6">Welcome, {username}</h2>
        <ul className="space-y-4">
          <li onClick={() => setPage("home")} className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <Home className="w-5 h-5" /> Home
          </li>
          <li onClick={() => setPage("doctors")} className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <Stethoscope className="w-5 h-5" /> Doctors
          </li>
          <li onClick={() => setPage("patients")} className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <Users className="w-5 h-5" /> Patients
          </li>
          <li onClick={() => setPage("appointments")} className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <CalendarDays className="w-5 h-5" /> Appointments
          </li>
          <li onClick={() => setPage("prescriptions")} className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <FileText className="w-5 h-5" /> Prescriptions
          </li>
        </ul>
      </div>

      {/* Logout button */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <button
          onClick={() => {
            localStorage.removeItem("username");
            onLogout();
          }}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 cursor-pointer w-full"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
