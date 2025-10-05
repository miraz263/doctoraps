import { useEffect, useState } from "react";

export default function Patients() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const res = await fetch("http://localhost:8000/api/patients/me/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch patient data");

      const data = await res.json();
      setPatient(data);
    } catch (err) {
      console.error("Error fetching patient:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!patient) {
    return <p className="text-gray-500 text-lg">No patient profile found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-2">{patient.name}</h2>
        <p className="text-gray-600 mb-4">
          {patient.email || "-"} | {patient.phone || "-"}
        </p>
      </div>

      <h3 className="font-bold text-gray-700 mb-2">My Prescriptions:</h3>
      {patient.prescriptions && patient.prescriptions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Doctor</th>
                <th className="px-6 py-3 text-left font-medium">Clinic</th>
                <th className="px-6 py-3 text-left font-medium">Hospital</th>
                <th className="px-6 py-3 text-left font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {patient.prescriptions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((pres) => (
                  <tr key={pres.id} className="border-b hover:bg-green-50">
                    <td className="px-6 py-3">{pres.date}</td>
                    <td className="px-6 py-3">{pres.doctor}</td>
                    <td className="px-6 py-3">{pres.clinic || "-"}</td>
                    <td className="px-6 py-3">{pres.hospital || "-"}</td>
                    <td className="px-6 py-3">{pres.details}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No prescriptions found.</p>
      )}
    </div>
  );
}
