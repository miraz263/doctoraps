import { Stethoscope, Users, CalendarDays, FileText, Home } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 min-h-screen p-5">
      <ul className="space-y-4">
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <Home className="w-5 h-5" /> Home
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <Stethoscope className="w-5 h-5" /> Doctors
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <Users className="w-5 h-5" /> Patients
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <CalendarDays className="w-5 h-5" /> Appointments
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <FileText className="w-5 h-5" /> Prescriptions
        </li>
      </ul>
    </aside>
  );
}
