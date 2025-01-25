import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import EditBookmarkModal from "./EditBookmarkModal";
import { bookmarksAPI } from "../services/api";

export default function BookmarkCard({ bookmark, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const data = await bookmarksAPI.getPreview(bookmark.url);
        setPreview(data);
      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [bookmark.url]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
  };

  return (
    <div
      className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg relative flex flex-col h-full"
      onClick={() => window.open(bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`, "_blank")}
    >
      {/* Preview Image */}
      <div className="mb-3 relative aspect-video bg-gray-100 rounded overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        ) : preview?.image ? (
          <img
            src={preview.image}
            alt={preview.title || bookmark.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No preview available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-md font-semibold mb-1">
          {preview?.title || bookmark.title || bookmark.url}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {preview?.description || bookmark.description}
        </p>
      </div>

      {/* Actions - moved to bottom right */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={handleEditClick}
          className="text-gray-400 hover:text-gray-600"
          title="Edit Bookmark"
        >
          <FaPen size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className="text-gray-400 hover:text-red-600"
          title="Delete Bookmark"
        >
          <FaTrash size={16} />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div onClick={(e) => e.stopPropagation()}>
          <EditBookmarkModal
            bookmark={bookmark}
            onClose={handleCloseEditModal}
            onSave={(updatedBookmark) => {
              setIsEditing(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
