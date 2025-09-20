import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Menu className="w-6 h-6 cursor-pointer hover:text-blue-400" />
        <span className="font-bold text-2xl tracking-wide">Doctor APS</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="hover:text-blue-400 transition-colors">Dashboard</button>
        <button className="hover:text-blue-400 transition-colors">Profile</button>
        <button className="hover:text-red-500 transition-colors">Logout</button>
      </div>
    </nav>
  );
}
