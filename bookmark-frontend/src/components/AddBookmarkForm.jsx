import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

/**
 * AddBookmarkForm
 * @param {Array} collections - Array of existing collections { id, name }
 * @param {Function} onSave - Callback when form is submitted (newBookmark, newCollectionName) => {}
 */
function AddBookmarkForm({ collections = [], onSave }) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  // Collection selection logic
  const [collectionId, setCollectionId] = useState("general"); // default
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  // Handle collection dropdown changes
  const handleCollectionChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      // User wants to create a new collection
      setCreatingNewCollection(true);
      setCollectionId("");
    } else {
      setCreatingNewCollection(false);
      setCollectionId(value);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    let finalCollectionId = collectionId;
    let finalNewCollectionName = newCollectionName.trim();

    // If user is creating a new collection
    if (creatingNewCollection && finalNewCollectionName) {
      // In a real app, you'd call an API to create the collection,
      // get its new ID, then assign it here. For now, we can mock:
      finalCollectionId = Date.now(); // mock ID
    }

    const newBookmark = {
      url,
      description,
      collectionId: finalCollectionId, 
      // Possibly other fields like title, tags, etc.
    };

    // onSave callback lets the parent handle the actual creation logic
    onSave(newBookmark, finalNewCollectionName);

    // Reset form
    setUrl("");
    setDescription("");
    setCollectionId("general");
    setCreatingNewCollection(false);
    setNewCollectionName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md space-y-3"
    >
      <h2 className="text-xl font-medium">Add Bookmark</h2>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block mb-1 font-medium">
          URL
        </label>
        <input
          id="url"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      {/* Collection Dropdown or New Collection Field */}
      <div>
        <label htmlFor="collection" className="block mb-1 font-medium">
          Collection
        </label>

        {/* If not creating a new collection, show the dropdown */}
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

        {/* Creating a new collection? Show input field */}
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

      {/* Description */}
      <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          Description
        </label>
        <textarea
          id="description"
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of the bookmark"
        />
      </div>

      {/* Submit Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}

export default AddBookmarkForm;
