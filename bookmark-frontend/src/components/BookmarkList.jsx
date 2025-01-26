import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { bookmarksAPI } from "../services/api";

function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  
  async function fetchBookmarks() {
    const response = await bookmarksAPI.getAll();
    return response.slice(0, 5);
  }

  useEffect(() => {
    fetchBookmarks().then((data) => {
      setBookmarks(data);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Bookmarks</h2>
        <Link
          to="/all-bookmarks"
          className="text-blue-500 text-sm hover:underline"
        >
          View All Bookmarks
        </Link>
      </div>
      <div>
        <ul className="space-y-2">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="border rounded p-3 hover:bg-gray-50"
            >
              <a 
                href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-xs text-blue-500 block"
              >
                <p className="font-bold">{bookmark.title}</p>
                <p className="text-sm text-gray-600">{bookmark.description}</p>
                <p className="text-xs text-gray-500">{bookmark.url}</p>
                <span className="text-xs text-gray-500">
                  Collection: {bookmark.collection_title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookmarkList;
