import React, { useState, useEffect } from "react";

/**
 * A placeholder for fetching all collections from the backend.
 * In your real app, you'd call an API like:
 *
 *   const response = await fetch("/api/collections")
 *   const data = await response.json()
 *   return data
 */
async function fetchCollectionsMock() {
  return [
    { id: 1, name: "Recipes", bookmarkCount: 5 },
    { id: 2, name: "News", bookmarkCount: 3 },
  ];
}

export default function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch all collections on component mount
    fetchCollectionsMock().then((data) => {
      setCollections(data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
          >
            <h2 className="font-semibold mb-2">{collection.name}</h2>
            <p className="text-sm text-gray-600">
              Bookmarks: {collection.bookmarkCount}
            </p>
            {/* Link to a detail page or show collection bookmarks inline */}
          </div>
        ))}
      </div>
    </div>
  );
}
