import Sidebar from "./Sidebar";

export default function Dashboard({ children, setPage, onLogout }) {
  return (
    <div className="flex">
      <Sidebar setPage={setPage} onLogout={onLogout} />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
