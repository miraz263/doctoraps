import { useEffect, useState } from "react";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const res = await fetch("http://localhost:8000/api/prescriptions/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch prescriptions");

      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Prescriptions</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : prescriptions.length === 0 ? (
        <p className="text-gray-500 text-lg">No prescriptions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Patient</th>
                <th className="px-6 py-3 text-left font-medium">Doctor</th>
                <th className="px-6 py-3 text-left font-medium">Medications</th>
                <th className="px-6 py-3 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-red-50 transition-colors"
                >
                  <td className="px-6 py-3">{p.id}</td>
                  <td className="px-6 py-3">{p.patient_name}</td>
                  <td className="px-6 py-3">{p.doctor_name}</td>
                  <td className="px-6 py-3">
                    {p.medications && p.medications.length > 0
                      ? p.medications.join(", ")
                      : "-"}
                  </td>
                  <td className="px-6 py-3">{p.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
