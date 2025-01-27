import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collectionsAPI } from "../services/api";


async function fetchCollections() {
  return collectionsAPI.getAll();
}

export default function Collections() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch all collections on component mount
    fetchCollections().then((data) => {
      setCollections(data);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Collections</h1>
        <button
          onClick={() => navigate('/collections/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Collection
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="bg-white rounded shadow p-4 hover:shadow-lg transition block"
          >
            <h2 className="font-semibold mb-2">{collection.title}</h2>
            <p className="text-sm text-gray-600">
              Create Date: {new Date(collection.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
