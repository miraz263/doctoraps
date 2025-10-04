// src/pages/LandingPage.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage({ goToLogin }) {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-2xl font-bold text-blue-600">Doctor APS</div>
          <div className="space-x-4">
            <button
              onClick={goToLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login / Register
            </button>
          </div>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md" data-aos="fade-right">
              <p className="mb-4">
                "Doctor APS helped me organize all my patient appointments in one place. Super easy!"
              </p>
              <h4 className="font-bold">Dr. Rahman</h4>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md" data-aos="fade-up">
              <p className="mb-4">
                "As a patient, I can now book appointments without any hassle."
              </p>
              <h4 className="font-bold">Sadia Ahmed</h4>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md" data-aos="fade-left">
              <p className="mb-4">
                "The prescription management system is a game-changer!"
              </p>
              <h4 className="font-bold">Dr. Karim</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6" data-aos="zoom-in">
          Ready to get started?
        </h2>
        <button
          onClick={goToLogin}
          className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          data-aos="zoom-in"
        >
          Sign Up / Login
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        © 2025 Doctor APS. All rights reserved.
      </footer>
    </div>
  );
}
