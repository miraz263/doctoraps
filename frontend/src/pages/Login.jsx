import React, { useState } from "react";
import { loginUser, registerUser } from "../api";

export default function Auth({ setIsAuthenticated, setRole }) {
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setLocalRole] = useState("doctor");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let data;
      if (mode === "login") {
        data = await loginUser(username, password, role);
      } else {
        await registerUser(username, email, password, role);
        data = await loginUser(username, password, role);
      }

      if (data.error) throw new Error(data.error);

      // ✅ Save token, role, username
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      // Update parent state
      setIsAuthenticated(true);
      setRole(role);

      // Redirect to dashboard
      window.location.href = data.dashboard_url;
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>

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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <select
          value={role}
          onChange={(e) => setLocalRole(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="agent">Agent/Tenant</option>
          <option value="management">Management</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-sm text-center mt-3">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-blue-600 underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
