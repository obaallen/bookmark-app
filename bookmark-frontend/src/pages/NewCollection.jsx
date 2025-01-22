import React, { useState } from "react";

export default function NewCollection() {
  const [collectionName, setCollectionName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your backend API to create a new collection
    console.log("Creating new collection:", collectionName);
    setCollectionName("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Collection</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 w-full max-w-md">
        <label className="block mb-2 font-medium" htmlFor="collectionName">
          Collection Name
        </label>
        <input
          id="collectionName"
          type="text"
          className="border rounded w-full px-3 py-2 mb-4"
          placeholder="e.g. Recipes, News, Work..."
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </form>
    </div>
  );
}
