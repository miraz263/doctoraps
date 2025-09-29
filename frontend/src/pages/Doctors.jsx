import { useEffect, useState } from "react";
import axiosInstance from "../api";
import { getAuthHeader } from "../auth"; // <-- change here

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/doctors/", {
        headers: getAuthHeader()  // <-- use getAuthHeader here
      });
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(err.response?.data?.detail || "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.specialization) {
      setError("Name and Specialization are required.");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/doctors/register/", formData, {
        headers: getAuthHeader()  // <-- use getAuthHeader here too
      });
      setSuccess(res.data.message);
      setFormData({ name: "", specialization: "", email: "", phone: "" });
      fetchDoctors(); // refresh list
    } catch (err) {
      console.error("Failed to add doctor:", err);
      setError(err.response?.data?.error || "Failed to add doctor.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Doctors</h1>

      {/* Add Doctor Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Doctor
        </button>
      </form>

      {/* Doctors Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : doctors.length === 0 ? (
        <p className="text-gray-500 text-lg">No doctors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Specialization</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-3">{doc.id}</td>
                  <td className="px-6 py-3">{doc.name}</td>
                  <td className="px-6 py-3">{doc.specialization}</td>
                  <td className="px-6 py-3">{doc.email}</td>
                  <td className="px-6 py-3">{doc.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
