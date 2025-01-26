import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookmarkCard from "../components/BookmarkCard";
import { collectionsAPI } from "../services/api"; 

async function fetchCollectionById(id) {
  const response = await collectionsAPI.getBookmarks(id);
  return response;
}

async function fetchCollectionTitle(id) {
  const response = await collectionsAPI.get(id);
  return response;
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">{collectionTitle?.title}</h1>
      {collection.length === 0 && (
        <p className="text-gray-500 text-center py-8">No bookmarks for collection</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-4">
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
