import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Dashboard({ children, setPage, currentPage, onLogout }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar setPage={setPage} currentPage={currentPage} onLogout={onLogout} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-auto">
        {/* Navbar */}
        <Navbar currentPage={currentPage} setPage={setPage} onLogout={onLogout} />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
