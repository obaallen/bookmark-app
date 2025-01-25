import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { authAPI } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);
  

  // Handle the actual signup + do validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      await authAPI.register(email, password);
      setEmail("");
      setPassword("");
      setConfirmation("");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <div className="mb-3">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium" htmlFor="confirmation">
            Confirm Password
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            id="confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
          type="submit"
        >
          Sign Up
        </button>
        {/* TODO: Add a link to the login page */}
        <p className="mt-2 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;
