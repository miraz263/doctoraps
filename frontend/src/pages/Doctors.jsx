import { useEffect, useMemo, useState } from "react";

function errText(err) {
  try {
    if (!err?.message) return "Network error";
    return err.message;
  } catch {
    return "Request failed.";
  }
}

export default function DoctorsPage({ username, role }) {
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
    bmdc_no: "",
  });

  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Get token and prepare Authorization header
  const token = localStorage.getItem("access");
  const authHeader = { 
    "Authorization": `Bearer ${token}`, 
    "Content-Type": "application/json" 
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    if (!token) return setDoctorsError("No access token found.");
    try {
      setLoadingDoctors(true);
      setDoctorsError(null);
      const res = await fetch("http://localhost:8000/api/doctors/", { headers: authHeader });
      if (!res.ok) throw new Error(`Failed to fetch doctors: ${res.status}`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setDoctorsError(errText(err));
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [token]);

  const doctorUserIds = useMemo(() => doctors.map((doc) => doc.user), [doctors]);

  // Fetch all users (admin only)
  useEffect(() => {
    if (role !== "admin" || !token) return;
    let cancelled = false;
    const loadUsers = async (url = "http://localhost:8000/api/users/") => {
      setLoadingUsers(true);
      try {
        const all = [];
        while (url) {
          const res = await fetch(url, { headers: authHeader });
          if (!res.ok) throw new Error("Failed to fetch users");
          const data = await res.json();
          all.push(...(Array.isArray(data) ? data : data.results || []));
          url = data?.next || null;
        }
        if (!cancelled) setUsers(all);
      } catch (err) {
        if (!cancelled) setUsersError(errText(err));
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    };
    loadUsers();
    return () => (cancelled = true);
  }, [role, token]);

  const filteredUsers = useMemo(() => {
    if (!q) return users;
    const search = q.toLowerCase();
    return users.filter(
      (u) =>
        (u.username && u.username.toLowerCase().includes(search)) ||
        (u.email && u.email.toLowerCase().includes(search)) ||
        String(u.id).includes(search)
    );
  }, [q, users]);

  // Add doctor (admin only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null); setSuccess(null);

    if (!userId || !formData.specialization.trim() || !formData.bmdc_no.trim()) {
      setSubmitError("User ID, Specialization এবং BMDC Number প্রয়োজন।");
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
        bmdc_no: formData.bmdc_no || "",
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
      setFormData({ specialization: "", name: "", email: "", phone: "", bmdc_no: "" });
      setUserId("");
      fetchDoctors();
    } catch (err) { setSubmitError(errText(err)); }
    finally { setSubmitting(false); }
  };

  // Inline edit (admin only)
  const handleUpdateDoctor = async (id, field, value) => {
    if (role !== "admin") return;
    try {
      const res = await fetch(`http://localhost:8000/api/doctors/${id}/update/`, {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update doctor");
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
    } catch (err) { alert(errText(err)); }
  };

  // Approve/Reject (admin only)
  const handleApproveReject = async (id, approve = true) => {
    if (role !== "admin") return;
    try {
      const res = await fetch(`http://localhost:8000/api/doctors/${id}/approve/`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ approve }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, approved: approve } : d))
      );
    } catch (err) { alert(errText(err)); }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Doctors Management</h1>

      {/* Admin-only Add Doctor Form */}
      {role === "admin" && (
        <div className="mb-6 p-6 bg-white rounded shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Doctor</h2>
          {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
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
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border p-2 w-full rounded"
              disabled={loadingUsers}
            >
              <option value="">
                {loadingUsers ? "Loading users..." : "Select a user"}
              </option>
              {filteredUsers.map((u) => (
                <option key={u.id} value={u.id} disabled={doctorUserIds.includes(u.id)}>
                  {u.username || u.email || `user#${u.id}`}
                  {doctorUserIds.includes(u.id) ? " (Already a doctor)" : ""}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              placeholder="Doctor Name (optional)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              placeholder="BMDC Number"
              value={formData.bmdc_no}
              onChange={(e) => setFormData({ ...formData, bmdc_no: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border p-2 w-full rounded"
            />

            <button
              type="submit"
              disabled={!userId || !formData.specialization.trim() || !formData.bmdc_no.trim() || submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add Doctor"}
            </button>
          </form>
        </div>
      )}

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
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Specialization</th>
                <th className="px-6 py-3 text-left">BMDC No</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Status</th>
                {role === "admin" && <th className="px-6 py-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-3">{doc.id}</td>
                  <td className="px-6 py-3">{role === "admin" ? <input
                    value={doc.name || ""}
                    onChange={(e) => handleUpdateDoctor(doc.id, "name", e.target.value)}
                    className="border p-1 w-full rounded"
                  /> : doc.name}</td>
                  <td className="px-6 py-3">{role === "admin" ? <input
                    value={doc.specialization || ""}
                    onChange={(e) => handleUpdateDoctor(doc.id, "specialization", e.target.value)}
                    className="border p-1 w-full rounded"
                  /> : doc.specialization}</td>
                  <td className="px-6 py-3">{role === "admin" ? <input
                    value={doc.bmdc_no || ""}
                    onChange={(e) => handleUpdateDoctor(doc.id, "bmdc_no", e.target.value)}
                    className="border p-1 w-full rounded"
                  /> : doc.bmdc_no}</td>
                  <td className="px-6 py-3">{role === "admin" ? <input
                    value={doc.email || ""}
                    onChange={(e) => handleUpdateDoctor(doc.id, "email", e.target.value)}
                    className="border p-1 w-full rounded"
                  /> : doc.email}</td>
                  <td className="px-6 py-3">{role === "admin" ? <input
                    value={doc.phone || ""}
                    onChange={(e) => handleUpdateDoctor(doc.id, "phone", e.target.value)}
                    className="border p-1 w-full rounded"
                  /> : doc.phone}</td>
                  <td className="px-6 py-3">
                    {doc.approved ? <span className="text-green-600 font-medium">Approved</span>
                    : <span className="text-yellow-600 font-medium">Pending</span>}
                  </td>
                  {role === "admin" && <td className="px-6 py-3 space-x-2">
                    {!doc.approved ? <button
                      onClick={() => handleApproveReject(doc.id, true)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >Approve</button> : <button
                      onClick={() => handleApproveReject(doc.id, false)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >Reject</button>}
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
