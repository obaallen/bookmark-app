import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import EditBookmarkModal from "./EditBookmarkModal";

export default function BookmarkCard({ bookmark, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
  };

  return (
    <div
      className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg relative"
      onClick={() => window.open(bookmark.url, "_blank")} // Open the link when the card is clicked
    >
      <h3 className="text-md font-semibold mb-1">
        {bookmark.title || bookmark.url}
      </h3>
      <p className="text-sm text-gray-600">{bookmark.description}</p>
      <div className="absolute top-2 right-2 flex space-x-2">
        {/* Edit Icon */}
        <button
          onClick={handleEditClick}
          className="text-gray-400 hover:text-gray-600"
          title="Edit Bookmark"
        >
          <FaPen size={16} />
        </button>
        {/* Delete Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent bubbling to the card's onClick
            onDelete(bookmark.id);
          }}
          className="text-gray-400 hover:text-red-600"
          title="Delete Bookmark"
        >
          <FaTrash size={16} />
        </button>
      </div>

      {/* Edit Bookmark Modal */}
      {isEditing && (
        <div onClick={(e) => e.stopPropagation() /* Prevent bubbling to the card */}>
          <EditBookmarkModal
            bookmark={bookmark}
            onClose={handleCloseEditModal}
            onSave={(updatedBookmark) => {
              setIsEditing(false);
              // Optionally, notify the parent about the updated bookmark
            }}
          />
        </div>
      )}
    </div>
  );
}
