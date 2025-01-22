import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState(null);

  // Handle the actual signup + do validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmation) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.post("/signup", {
        email,
        password,
        confirmation,
      });

      console.log("Signup response:", response);

      // Simulate successful signup
      if (response.status === 200) {
        setMessage("Signup successful!");
        setEmail("");
        setPassword("");
        setConfirmation("");
        // Redirect to the homepage
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setMessage("Signup failed. Please try again.");
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
      </form>
    </div>
  );
}

export default Signup;
