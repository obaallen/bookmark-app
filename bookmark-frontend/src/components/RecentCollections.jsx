import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Fetching collections from the backend
 */
async function fetchCollections() {
  const response = await fetch('http://127.0.0.1:5000/collections', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'
  });
  const data = await response.json();
  return data.slice(0, 6);
}

export default function RecentCollections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections().then((data) => {
      setCollections(data);
    });
  }, []);

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Collections</h2>
        <Link
          to="/collections"
          className="text-blue-500 text-sm hover:underline"
        >
          View All Collections
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-gray-100 rounded p-3 hover:bg-gray-200 transition"
          >
            <h3 className="font-medium">{collection.title}</h3>
          
          </div>
        ))}
      </div>
    </div>
  );
}
