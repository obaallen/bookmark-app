import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * A placeholder for fetching all collections from the backend.
 * In your real app, you'd call an API like:
 *
 */
async function fetchCollections() {
  const response = await fetch('http://127.0.0.1:5000/collections', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'
  });
  const data = await response.json();
  return data;
}

export default function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch all collections on component mount
    fetchCollections().then((data) => {
      setCollections(data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="bg-white rounded shadow p-4 hover:shadow-lg transition block"
          >
            <h2 className="font-semibold mb-2">{collection.title}</h2>
            <p className="text-sm text-gray-600">
              Bookmarks: {collection.bookmarkCount}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
