import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookmarkCard from "../components/BookmarkCard";

async function fetchCollectionById(id) {
  const response = await fetch(`http://127.0.0.1:5000/collection_bookmarks/${id}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'
  });
  const data = await response.json();
  return data;
}

async function fetchCollectionTitle(id) {
  const response = await fetch(`http://127.0.0.1:5000/collections/${id}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'
  });
  const data = await response.json();
  return data;
}

export default function CollectionDetail() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [collectionTitle, setCollectionTitle] = useState(null);

  useEffect(() => {
    fetchCollectionById(collectionId).then((data) => {
      setCollection(data);
    });
    fetchCollectionTitle(collectionId).then((data) => {
      setCollectionTitle(data);
    });
  }, [collectionId]);

  if (!collection) {
    return <p>Loading collection...</p>;
  }

  const handleDeleteBookmark = (bookmarkId) => {
    setCollection((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((bm) => bm.id !== bookmarkId),
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{collectionTitle?.title}</h1>
      {collection.length === 0 && (
        <p className="text-gray-500 text-center py-8">No bookmarks for collection</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collection.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={handleDeleteBookmark}
          />
        ))}
      </div>
    </div>
  );
}
