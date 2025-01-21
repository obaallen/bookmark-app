import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Mock API for fetching collections
 */
async function fetchCollectionsMock() {
  return [
    { id: 1, name: "Recipes", bookmarkCount: 5, updatedAt: "2025-01-18" },
    { id: 2, name: "News", bookmarkCount: 3, updatedAt: "2025-01-17" },
    { id: 3, name: "Tech Blogs", bookmarkCount: 7, updatedAt: "2025-01-16" },
    { id: 4, name: "Work Docs", bookmarkCount: 2, updatedAt: "2025-01-15" },
    { id: 5, name: "Health Tips", bookmarkCount: 6, updatedAt: "2025-01-14" },
    { id: 6, name: "Travel Plans", bookmarkCount: 4, updatedAt: "2025-01-13" },
  ];
}

export default function RecentCollections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch collections from API
    fetchCollectionsMock().then((data) => {
      // Sort by `updatedAt` (if available) and take the most recent 5
      const sortedCollections = data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setCollections(sortedCollections.slice(0, 5));
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
            <h3 className="font-medium">{collection.name}</h3>
            <p className="text-sm text-gray-600">
              Bookmarks: {collection.bookmarkCount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
