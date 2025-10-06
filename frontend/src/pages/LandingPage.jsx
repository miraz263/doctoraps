import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage({ goToLogin }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    problem: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize animations and fetch doctor list
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetch("http://127.0.0.1:8000/api/doctors/")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or failed to fetch doctors");
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Handle appointment submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      doctor: selectedDoctor.id,
      patient_name: formData.name,
      patient_phone: formData.phone,
      appointment_date: formData.date,
      appointment_time: formData.time,
      patient_problem: formData.problem,
    };

    fetch("http://127.0.0.1:8000/api/appointments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to book appointment");
        alert("✅ Appointment booked successfully!");
        setFormData({ name: "", phone: "", date: "", time: "", problem: "" });
        setShowModal(false);
      })
      .catch(() => {
        alert("❌ Failed to book appointment. Please try again.");
      });
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-2xl font-bold text-blue-600">Doctor APS</div>
          <button
            onClick={goToLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login / Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="relative h-screen flex items-center justify-center bg-cover bg-center mt-16"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" data-aos="fade-down">
            Manage Appointments & Prescriptions
          </h1>
          <p className="text-xl md:text-2xl mb-6" data-aos="fade-up">
            A complete system for Doctors, Patients, and Clinics.
          </p>
          <button
            onClick={goToLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition"
            data-aos="zoom-in"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="100">
              <h3 className="font-bold text-xl mb-3">Manage Doctors</h3>
              <p>Easily manage doctor profiles, schedules, and availability.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="200">
              <h3 className="font-bold text-xl mb-3">Appointments</h3>
              <p>Monitor all appointments and patient visits in one place.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="300">
              <h3 className="font-bold text-xl mb-3">Prescriptions</h3>
              <p>Create, store, and manage prescriptions securely online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor List Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
            Our Doctors
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading doctors...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                  data-aos="zoom-in"
                >
                  <img
                    src={doc.image || "/images/doctor-placeholder.jpg"}
                    alt={doc.name}
                    className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold">{doc.name}</h3>
                  <p className="text-gray-600">{doc.specialization}</p>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setShowModal(true);
                    }}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Appointment Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Book with {selectedDoctor.name}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Describe your problem"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full border rounded px-3 py-2"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        © 2025 Doctor APS. All rights reserved.
      </footer>
    </div>
  );
}
