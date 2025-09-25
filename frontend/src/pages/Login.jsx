import React, { useState } from "react";

export default function Auth({ setPage }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "login") {
        // --- LOGIN API ---
        await loginUser(username, password);
      } else {
        // --- REGISTER API ---
        const response = await fetch("http://localhost:8000/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Registration failed");

        // Auto-login after registration
        await loginUser(username, password);
        setMessage("Registration successful! Logged in automatically.");
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    }
  };

  const loginUser = async (username, password) => {
    const response = await fetch("http://localhost:8000/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Login failed");
    }

    const data = await response.json();

    // Save tokens
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    // Save username for Sidebar/Navbar
    localStorage.setItem("username", username);

    // Redirect to home/dashboard
    setPage("home");
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

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Email field only for register */}
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

        {/* Password */}
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
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        {/* Toggle between login/register */}
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
