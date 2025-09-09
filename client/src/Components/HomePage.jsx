import React from "react";
import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 text-center">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-white mb-6 font-['Inter']">
        Master Your Tasks
      </h1>

      {/* Quotes */}
      <p className="text-xl text-gray-300 italic mb-3">
        "Plan smarter, achieve more."
      </p>
      <p className="text-xl text-gray-300 italic mb-8">
        "Effortless task management for a productive life."
      </p>

      {/* Get Started Button */}
      <Link
        to="/login"
        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out"
      >
        Get Started
      </Link>
    </div>
  );
}

export default WelcomePage;