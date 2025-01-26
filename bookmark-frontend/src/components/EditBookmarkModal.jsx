import React, { useState, useEffect } from "react";
import { bookmarksAPI } from "../services/api";
import { FaPlus } from "react-icons/fa";
import { collectionsAPI } from "../services/api";

export default function EditBookmarkModal({ onClose, onSave, bookmark }) {
  const [collections, setCollections] = useState([]); 
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description || "");
  const [collectionId, setCollectionId] = useState(bookmark.collectionId); 
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [error, setError] = useState("");

    // Fetch collections when the modal is mounted
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await collectionsAPI.getAll();
        setCollections(response);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to load collections");
      }
    };
    fetchCollections();
  }, []);

  const handleCollectionChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setCreatingNewCollection(true);
      setCollectionId("");
    } else {
      setCreatingNewCollection(false);
      setCollectionId(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalCollectionId = collectionId;

      // If creating a new collection
      if (creatingNewCollection && newCollectionName) {
        const newCollection = await collectionsAPI.create({
          title: newCollectionName,
        });
        finalCollectionId = newCollection.id;
      }

      const updatedBookmark = await bookmarksAPI.update(bookmark.id, {
        url,
        title,
        description,
        collectionId: finalCollectionId,
      });
      onSave(updatedBookmark);
      onClose();
      window.location.reload();
    } catch (error) {
      setError(error.message || "Failed to update bookmark");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()} // Prevent bubbling to parent
    >
      <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent bubbling
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Bookmark</h2>
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()} // Prevent bubbling
          className="space-y-4"
        >
          
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="border rounded w-full px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="url">
              URL
            </label>
            <input
              id="url"
              type="text"
              className="border rounded w-full px-3 py-2"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          {/* Collection Dropdown */}
          <div>
            <label htmlFor="collection" className="block mb-1 font-medium">
              Collection
            </label>
            {!creatingNewCollection && (
              <select
                id="collection"
                className="border rounded w-full px-3 py-2"
                value={collectionId}
                onChange={handleCollectionChange}
              >
                {collections.length === 0 ? (
                  <option value="">No collections available</option>
                ) : (
                  <>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                  </>
                )}
                <option value="">Select a collection</option>
                <option value="new">+ New Collection</option>
              </select>
            )}
            {creatingNewCollection && (
              <div className="mt-2">
                <input
                  type="text"
                  className="border rounded w-full px-3 py-2"
                  placeholder="New collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCreatingNewCollection(false);
                    setNewCollectionName("");
                  }}
                  className="text-sm text-gray-500 mt-1 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="border rounded w-full px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling
                onClose();
              }}
              type="button"
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
