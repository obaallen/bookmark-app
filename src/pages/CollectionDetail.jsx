import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

async function fetchCollectionById(id) {
  // Mock. Replace with real API call
  return {
    id,
    name: "Recipes",
    bookmarks: [
      {
        id: 101,
        url: "https://cookingblog.com/pizza",
        description: "Pizza recipe",
      },
    ],
  };
}

export default function CollectionDetail() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    fetchCollectionById(collectionId).then((data) => {
      setCollection(data);
    });
  }, [collectionId]);

  if (!collection) {
    return <p>Loading collection...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {collection.name} (Collection #{collection.id})
      </h1>
      <ul className="space-y-2">
        {collection.bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="border rounded p-2 hover:bg-gray-50">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {bookmark.url}
            </a>
            <p className="text-sm text-gray-600">{bookmark.description}</p>
          </li>
        ))}
      </ul>
      {/* You could add a form here to add a new bookmark to this collection */}
    </div>
  );
}
