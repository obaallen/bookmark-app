import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function EditBookmarkModal({
  bookmark,
  onClose,
  onSave,
  collections,   // Array of existing collections
}) {
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description);
  // The bookmark’s current collection ID (or “general”)
  const [collectionId, setCollectionId] = useState(
    bookmark.collectionId || "general"
  );

  // Track whether user wants to create a new collection
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalCollectionId = collectionId;
    if (creatingNewCollection && newCollectionName.trim()) {
      // In a real app, you'd POST to /api/collections, get the new ID
      // For now, just mock an ID or handle it in state
      const newId = Date.now(); // or real ID from API
      // Save new collection in parent or global state if needed
      finalCollectionId = newId;
    }

    const updatedBookmark = {
      ...bookmark,
      url,
      title,
      description,
      collectionId: finalCollectionId,
    };

    onSave(updatedBookmark, newCollectionName.trim());
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Bookmark</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Collection Dropdown */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="collection">
              Collection
            </label>
            {!creatingNewCollection && (
              <select
                id="collection"
                className="border rounded w-full px-3 py-2"
                value={collectionId}
                onChange={handleCollectionChange}
              >
                <option value="general">General (Default)</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
                <option value="new">
                  <FaPlus className="inline" /> New Collection...
                </option>
              </select>
            )}

            {/* Creating a new collection */}
            {creatingNewCollection && (
              <div className="flex items-center space-x-2">
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
                    setCollectionId("general");
                  }}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
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
