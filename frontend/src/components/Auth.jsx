import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/"; // Django backend URL

export default function Auth({ setIsAuthenticated, setRole }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setUserRole] = useState("patient"); // dropdown role
  const [message, setMessage] = useState("");

  // -------------------------
  // Login function
  // -------------------------
  const loginUser = async (username, password, role) => {
    const res = await fetch(`${BASE_URL}login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    // Store JWT tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("dashboard_url", data.dashboard_url);

    setIsAuthenticated(true); // 🔥 ফিক্স
    setRole(role);
  };

  // -------------------------
  // Register function
  // -------------------------
  const registerUser = async () => {
    const res = await fetch(`${BASE_URL}register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    // Auto-login after registration
    await loginUser(username, password, role);

    // If role is doctor, create doctor profile
    if (role === "doctor") {
      const doctorRes = await fetch(`${BASE_URL}doctors/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          user_id: data.id,
          specialization: "General",
          consultation_fee: 0,
        }),
      });

      const doctorData = await doctorRes.json();
      if (!doctorRes.ok) throw new Error(doctorData.error || "Doctor registration failed");
    }

    setMessage("Registration successful! Logged in automatically.");
  };

  // -------------------------
  // Form submission
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "login") {
        await loginUser(username, password, role);
      } else {
        await registerUser();
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h2>

        {message && <p className="text-red-500 mb-2">{message}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {mode === "register" && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
            required
          />
        )}

        <select
          value={role}
          onChange={(e) => setUserRole(e.target.value)}
          className="w-full border p-2 mb-3 rounded bg-white"
        >
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="agent">Agent/Tenant</option>
          <option value="management">Management</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-sm text-center mt-3">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button type="button" onClick={() => setMode("register")} className="text-blue-600 underline">
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-blue-600 underline">
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
