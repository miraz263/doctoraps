import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Doctors({ username, role }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    consultation_fee: "",
    bmdc_no: "",
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // ✅ Use the correct token key
  const token = localStorage.getItem("access_token");

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setDoctorsError(null);

      try {
        if (!token) throw new Error("No access token found.");

        const response = await axios.get("http://127.0.0.1:8000/api/doctors/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctors(response.data);
      } catch (err) {
        setDoctorsError(err.response?.data?.detail || err.message);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [token]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("No access token found.");

    try {
      if (editingDoctorId) {
        // Update doctor
        await axios.put(
          `http://127.0.0.1:8000/api/doctors/${editingDoctorId}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingDoctorId(null);
      } else {
        // Add doctor
        await axios.post("http://127.0.0.1:8000/api/doctors/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Refresh list
      const response = await axios.get("http://127.0.0.1:8000/api/doctors/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);

      // Reset form
      setFormData({ name: "", specialization: "", consultation_fee: "", bmdc_no: "" });
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  // Edit doctor
  const handleEdit = (doctor) => {
    setEditingDoctorId(doctor.id);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      consultation_fee: doctor.consultation_fee,
      bmdc_no: doctor.bmdc_no,
    });
  };

  // Delete doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    if (!token) return alert("No access token found.");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(doctors.filter((doc) => doc.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Doctors</h1>

      {loadingDoctors && <p>Loading doctors...</p>}
      {doctorsError && <p className="text-red-500">{doctorsError}</p>}
      {!loadingDoctors && doctors.length === 0 && <p>No doctors found.</p>}

      {/* Admin Add/Edit Form */}
      {role === "admin" && (
        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
          <h2 className="font-semibold mb-2">
            {editingDoctorId ? "Edit Doctor" : "Add Doctor"}
          </h2>

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            name="consultation_fee"
            placeholder="Consultation Fee"
            value={formData.consultation_fee}
            onChange={handleChange}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            name="bmdc_no"
            placeholder="BMDC No"
            value={formData.bmdc_no}
            onChange={handleChange}
            className="border p-2 mb-2 w-full rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            {editingDoctorId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* Doctors List */}
      <ul className="space-y-2">
        {doctors.map((doc) => (
          <li
            key={doc.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <span>
              {doc.name} - {doc.specialization} - Fee: {doc.consultation_fee}
            </span>
            {role === "admin" && (
              <div>
                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
