import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { bookmarksAPI, collectionsAPI } from "../services/api";

function AddBookmarkForm({ onSave }) {
  const [collections, setCollections] = useState([]); // Manage collections as local state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState(""); // Default is empty until collections are fetched
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(true);  // Add loading state

  // Fetch collections when the component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await collectionsAPI.getAll();
        setCollections(data);
        if (data.length > 0) {
          setCollectionId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setIsLoading(false);
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
      
      if (creatingNewCollection && newCollectionName.trim()) {
        const collectionData = await collectionsAPI.create({
          title: newCollectionName.trim(),
          description: ''
        });
        finalCollectionId = collectionData.collection.id;
      }

      await bookmarksAPI.create({
        url,
        description,
        collectionId: finalCollectionId,
        title: title,
      });

      // Reset form
      setUrl('');
      setDescription('');
      setCollectionId(collections[0]?.id || '');
      setCreatingNewCollection(false);
      setNewCollectionName('');
      window.location.reload();
    } catch (error) {
      console.error('Error creating bookmark:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md space-y-3"
    >
      <h2 className="text-xl font-medium">Add Bookmark</h2>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-1 font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example Title"
          required
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
          className="w-full border rounded px-3 py-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      {/* Collection Dropdown */}
      <div>
        <label htmlFor="collection" className="block mb-1 font-medium">
          Collection
        </label>
        
        {isLoading ? (
          <div className="border rounded w-full px-3 py-2 text-gray-500">
            Loading collections...
          </div>
        ) : !creatingNewCollection && (
          <select
            id="collection"
            className="border rounded w-full px-3 py-2"
            value={collectionId}
            onChange={handleCollectionChange}
            disabled={isLoading}
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
