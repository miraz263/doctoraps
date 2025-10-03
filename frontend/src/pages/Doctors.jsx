import { useEffect, useMemo, useState } from "react";

// Error handling helpers
function pickMsgFromData(data) {
  if (!data) return null;
  if (typeof data === "string") {
    if (data.includes("<!DOCTYPE html") || data.includes("<html")) return null;
    return data;
  }
  if (data.detail) return data.detail;
  if (data.error) return data.error;
  const keys = Object.keys(data);
  if (keys.length) {
    const k = keys[0];
    const v = Array.isArray(data[k]) ? data[k].join(", ") : String(data[k]);
    return `${k}: ${v}`;
  }
  return null;
}

function errText(err) {
  try {
    if (!err?.message) return "Network error";
    return err.message;
  } catch {
    return "Request failed.";
  }
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const [q, setQ] = useState("");
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    specialization: "",
    name: "",
    email: "",
    phone: "",
  });

  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const extractList = (data) => (Array.isArray(data) ? data : data?.results || []);

  const token = localStorage.getItem("access");
  const authHeader = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // Fetch users
  useEffect(() => {
    let cancelled = false;
    async function loadUsers(url = "http://localhost:8000/api/users/") {
      setLoadingUsers(true);
      try {
        const all = [];
        while (url) {
          const res = await fetch(url, { headers: authHeader });
          if (!res.ok) throw new Error(`Failed to fetch users`);
          const data = await res.json();
          all.push(...extractList(data));
          url = data?.next || null;
        }
        if (!cancelled) setUsers(all);
      } catch (err) {
        if (!cancelled) setUsersError(errText(err));
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }
    loadUsers();
    return () => (cancelled = true);
  }, []);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setDoctorsError(null);
      const res = await fetch("http://localhost:8000/api/doctors/", { headers: authHeader });
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors(extractList(data));
    } catch (err) {
      setDoctorsError(errText(err));
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const doctorUserIds = useMemo(() => doctors.map((doc) => doc.user), [doctors]);

  const filteredUsers = useMemo(() => {
    if (!q) return users;
    const s = q.toLowerCase();
    return users.filter(
      (u) =>
        (u.username && u.username.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s)) ||
        String(u.id).includes(s)
    );
  }, [q, users]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(null);

    if (!userId || !formData.specialization.trim()) {
      setSubmitError("User ID এবং Specialization প্রয়োজন।");
      return;
    }

    if (doctorUserIds.includes(Number(userId))) {
      setSubmitError("This user is already registered as a doctor.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        user_id: Number(userId),
        specialization: formData.specialization.trim(),
        name: formData.name || undefined,
        email: formData.email || undefined,
        phone: formData.phone || "",
      };

      const res = await fetch("http://localhost:8000/api/doctors/register/", {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Doctor registration failed");
      }

      setSuccess("Doctor added successfully!");
      setFormData({ specialization: "", name: "", email: "", phone: "" });
      setUserId("");
      fetchDoctors();
    } catch (err) {
      setSubmitError(errText(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Doctors Management</h1>

      {/* Add Doctor Form */}
      <div className="mb-6 p-6 bg-white rounded shadow-md max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Doctor</h2>

        {submitError && <p className="text-red-500 mb-2 break-words">{submitError}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <div className="mb-3">
          <label className="block font-medium mb-1">Search users</label>
          <input
            type="text"
            placeholder="username/email/id"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">User</label>
            {!usersError ? (
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border p-2 w-full rounded"
                disabled={loadingUsers}
              >
                <option value="">
                  {loadingUsers ? "Loading users..." : "Select a user"}
                </option>
                {filteredUsers.map((u) => {
                  const isAlreadyDoctor = doctorUserIds.includes(u.id);
                  return (
                    <option key={u.id} value={u.id} disabled={isAlreadyDoctor}>
                      {(u.username || u.email || "user")} #{u.id}
                      {isAlreadyDoctor ? " (Already a doctor)" : ""}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type="number"
                placeholder="Enter user_id manually"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border p-2 w-full rounded"
              />
            )}
            {userId && doctorUserIds.includes(Number(userId)) && (
              <p className="text-red-500 mt-1">This user is already registered as a doctor.</p>
            )}
          </div>

          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="name"
            placeholder="Doctor Name (optional)"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <button
            type="submit"
            disabled={
              !userId ||
              !formData.specialization.trim() ||
              submitting ||
              doctorUserIds.includes(Number(userId))
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Doctor"}
          </button>
        </form>
      </div>

      {/* Doctors Table */}
      <div className="overflow-x-auto bg-white rounded shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Doctors List</h2>
        {loadingDoctors ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : doctorsError ? (
          <p className="text-red-500 break-words">{doctorsError}</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">No doctors found.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
