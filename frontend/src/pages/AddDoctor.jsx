import React, { useState } from "react";
import axiosInstance from "../api"; // make sure you have axiosInstance configured
import { getAuthHeader } from "../auth";

export default function AddDoctor({ onDoctorAdded }) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !specialization) {
      setError("Name and specialization are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/doctors/register/",
        { name, specialization, email, phone },
        { headers: getAuthHeader() }
      );

      setSuccess("Doctor added successfully!");
      setName("");
      setSpecialization("");
      setEmail("");
      setPhone("");

      // Callback to refresh doctor list / stats
      if (onDoctorAdded) onDoctorAdded();
    } catch (err) {
      console.error("Failed to add doctor:", err);
      setError(
        err.response?.data?.error || "Failed to add doctor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-4">Add Doctor</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Specialization</label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}
