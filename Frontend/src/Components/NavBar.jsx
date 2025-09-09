import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-300">TODO</h1>

        {/* Login Button */}
        <button
          onClick={() => navigate('/login')}
          className="bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default NavBar;