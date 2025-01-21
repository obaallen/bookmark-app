import React from "react";

function BookmarkList() {
  // TODO: This would be fetched from the backend
  const mockBookmarks = [
    {
      id: 1,
      url: "https://example.com",
      category: "Work",
      description: "An example site for demonstration",
    },
    {
      id: 2,
      url: "https://react.dev",
      category: "Tech",
      description: "React official documentation",
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-medium mb-3">My Bookmarks</h2>
      <ul className="space-y-2">
        {mockBookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="border rounded p-3 hover:bg-gray-50"
          >
            <p className="font-bold">{bookmark.url}</p>
            <p className="text-sm text-gray-600">{bookmark.description}</p>
            <span className="text-xs text-gray-500">
              Category: {bookmark.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookmarkList;
