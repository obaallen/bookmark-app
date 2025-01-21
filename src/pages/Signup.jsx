import React, { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call signup endpoint in backend
    console.log("Signing up with:", { email, password });
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
