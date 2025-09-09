import React, { useContext, useState } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstane.js";

function Login() { 
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AppContent);

  const [state, setState] = useState(false); // false = signup, true = login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Axios instance already has withCredentials
      if (state) {
        // LOGIN
        const { data } = await axiosInstance.post("/auth/login", { email, password });
        if (data.success) {
          setIsLoggedIn(true);
          localStorage.setItem("token", data.token);  // save token
          navigate("/Todo1");                        // navigate
        } else {
          toast.error(data.message);
        }
      } else {
        // SIGNUP
        const { data } = await axiosInstance.post("/auth/register", { name, email, password });
        if (data.success) {
          setIsLoggedIn(true);
          localStorage.setItem("token", data.token);
          navigate("/Todo1");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-6">
      <div className="bg-gray-700 shadow-lg rounded-2xl w-full max-w-md p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-300 text-center mb-6">
          {state ? "Welcome Back" : "Create Account"}
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!state && (
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {state && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => alert("Reset password flow")}
                className="text-sm text-blue-400 hover:text-blue-300 transition duration-200"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-650 hover:bg-gray-500 text-gray-300 font-medium py-2 rounded-lg transition duration-200 shadow-md"
          >
            {state ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-sm text-gray-400 text-center mt-6">
          {state ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setState(!state)}
            className="text-blue-400 font-medium hover:text-blue-300 transition duration-200"
          >
            {state ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
