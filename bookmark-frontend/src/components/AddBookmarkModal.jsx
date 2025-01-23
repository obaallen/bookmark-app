import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import axiosInstance from "../axiosInstance";

export default function AddBookmarkModal({ collections, onClose, onSave }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState("general");
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCollectionId = collectionId;
    if (creatingNewCollection && newCollectionName.trim()) {
      // Execute API call to create collection
      const response = await fetch('http://127.0.0.1:5000/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newCollectionName })
      });
      const data = await response.json();
      finalCollectionId = data.collection.id;
    }

    // Create the bookmark
    const response = await fetch('http://127.0.0.1:5000/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        description,
        collectionId: finalCollectionId,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create bookmark');
    }

    onSave();

    // Reset form and close modal
    setUrl("");
    setTitle("");
    setDescription("");
    setCollectionId("general");
    setCreatingNewCollection(false);
    setNewCollectionName("");
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
        <h2 className="text-xl font-bold mb-4">Add Bookmark</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block mb-1 font-medium">
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
            <label htmlFor="title" className="block mb-1 font-medium">
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
            <label htmlFor="description" className="block mb-1 font-medium">
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
                    setCollectionId("general");
                  }}
                  className="text-sm text-gray-500 mt-1 hover:text-gray-700"
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
