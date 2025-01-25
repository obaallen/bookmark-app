import React, { useState, useEffect } from "react";
import BookmarkCard from "../components/BookmarkCard";
import AddBookmarkModal from "../components/AddBookmarkModal";
import { bookmarksAPI } from "../services/api";

export default function AllBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchBookmarks = async () => {
    try {
      const data = await bookmarksAPI.getAll();
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Bookmarks</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Bookmark
        </button>
      </div>

      {/* Bookmarks List */}
      <div>
        {Object.values(
          bookmarks.reduce((acc, bookmark) => {
            if (!acc[bookmark.collection_id]) {
              acc[bookmark.collection_id] = {
                collection_id: bookmark.collection_id,
                collection_title: bookmark.collection_title,
                bookmarks: []
              };
            }
            acc[bookmark.collection_id].bookmarks.push(bookmark);
            return acc;
          }, {})
        ).map((collection) => (
          <div
            key={collection.collection_id.toString()}
            className="border-t border-gray-200 pt-4"
          >
            {/* Collection Header */}
            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-semibold">{collection.collection_title}</h2>
            </div>
            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
              {collection.bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <AddBookmarkModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchBookmarks();
          }}
        />
      )}
    </div>
  );
}
