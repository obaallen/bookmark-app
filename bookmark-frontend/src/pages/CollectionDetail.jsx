import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookmarkCard from "../components/BookmarkCard";

async function fetchCollectionById(id) {
  return {
    id,
    name: "Recipes",
    bookmarks: [
      {
        id: 101,
        url: "https://cookingblog.com/pizza",
        title: "Pizza Recipe",
        description: "Delicious homemade pizza guide",
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

  const handleDeleteBookmark = (bookmarkId) => {
    setCollection((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((bm) => bm.id !== bookmarkId),
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{collection.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collection.bookmarks.map((bookmark) => (
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
