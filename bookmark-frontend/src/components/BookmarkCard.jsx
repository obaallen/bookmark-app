import React, { useState, useCallback, memo } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useInView } from 'react-intersection-observer';
import EditBookmarkModal from "./EditBookmarkModal";
import { bookmarksAPI } from "../services/api";

const BookmarkCard = memo(({ bookmark, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Set up intersection observer
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger once
    threshold: 0.1 // Trigger when 10% of the card is visible
  });

  // Fetch preview when card comes into view
  const fetchPreview = useCallback(async () => {
    if (!inView) return; // Don't fetch if not in view

    // Check cache first
    const cachedPreview = localStorage.getItem(`preview-${bookmark.url}`);
    if (cachedPreview) {
      setPreview(JSON.parse(cachedPreview));
      setLoading(false);
      return;
    }

    try {
      const data = await bookmarksAPI.getPreview(bookmark.url);
      setPreview(data);
      localStorage.setItem(`preview-${bookmark.url}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setLoading(false);
    }
  }, [inView, bookmark.url]);

  // Only fetch when card comes into view
  React.useEffect(() => {
    if (inView) {
      fetchPreview();
    }
  }, [inView, fetchPreview]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleImageError = useCallback((e) => {
    setImageError(true);
    e.target.src = '/placeholder-image.png';
  }, []);

  const handleCardClick = useCallback(() => {
    window.open(
      bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`,
      "_blank"
    );
  }, [bookmark.url]);

  const handleDelete = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await bookmarksAPI.delete(bookmark.id);
      onDelete(bookmark.id);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  }, [bookmark.id, onDelete]);

  return (
    <div
      ref={ref} // Add intersection observer ref
      className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg relative flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Preview Image */}
      <div className="mb-3 relative aspect-video bg-gray-100 rounded overflow-hidden">
        {!inView || loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        ) : preview?.image && !imageError ? (
          <img
            loading="lazy"
            src={preview.image}
            alt={preview.title || bookmark.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
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

      {/* Actions */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={handleEditClick}
          className="text-gray-400 hover:text-gray-600"
          title="Edit Bookmark"
        >
          <FaPen size={16} />
        </button>
        <button
          onClick={handleDelete}
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
            onSave={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
});

BookmarkCard.displayName = 'BookmarkCard';

export default BookmarkCard;
