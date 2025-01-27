import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { collectionsAPI } from "../services/api";
import { bookmarksAPI } from "../services/api";
export default function AddBookmarkModal({ onClose, onSave }) {
  const [collections, setCollections] = useState([]); 
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState(""); 
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionsAPI.getAll();
        setCollections(data);
        if (data.length > 0) {
          setCollectionId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
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

    let finalCollectionId = collectionId;

    try {
      // If creating a new collection, save it first
      if (creatingNewCollection && newCollectionName.trim()) {
        const response = await collectionsAPI.create({
          title: newCollectionName.trim()
        });
        finalCollectionId = response.collection.id;
      }

      // Create the bookmark
      await bookmarksAPI.create({
        url,
        title,
        description,
        collectionId: finalCollectionId,
      });

      // Notify parent component
      onSave();
      // close modal
      onClose();
    } catch (error) {
      console.error("Error creating bookmark:", error);
      alert(`${error.message}`);
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
          {/* Title */}
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

          {/* URL */}
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
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="border rounded w-full px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the bookmark"
            />
          </div>

          {/* Actions */}
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
