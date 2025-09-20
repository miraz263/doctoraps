import { useEffect, useState } from "react";
import axiosInstance from "../api";
import { getAuthHeader } from "../auth";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("appointments/", { headers: getAuthHeader() });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Appointments</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 text-lg">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Patient</th>
                <th className="px-6 py-3 text-left font-medium">Doctor</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-yellow-50 transition-colors">
                  <td className="px-6 py-3">{a.id}</td>
                  <td className="px-6 py-3">{a.patient_name}</td>
                  <td className="px-6 py-3">{a.doctor_name}</td>
                  <td className="px-6 py-3">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
