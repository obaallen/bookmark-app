import React, { useState } from "react";

export default function EditBookmarkModal({
  bookmark,
  onClose,
  onSave,
  collections = [],
}) {
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description);
  const [collectionId, setCollectionId] = useState(
    bookmark.collectionId || "general"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent click events
    onSave({
      ...bookmark,
      url,
      title,
      description,
      collectionId,
    });
  };

  const handleCollectionChange = (e) => {
    setCollectionId(e.target.value);
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

          <div>
            <label className="block mb-1 font-medium" htmlFor="collection">
              Collection
            </label>
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
            </select>
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
