import React, { useState, useEffect } from "react"

function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  
  async function fetchBookmarks() {
    const response = await fetch('http://127.0.0.1:5000/bookmarks', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    });
    const data = await response.json();
    return data.slice(0, 5);
  }

  useEffect(() => {
    fetchBookmarks().then((data) => {
      setBookmarks(data);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-medium mb-3">My Bookmarks</h2>
      <ul className="space-y-2">
        {bookmarks.map((bookmark) => (
          <a 
          href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-xs text-blue-500 block"
          >
            <li
              key={bookmark.id}
              className="border rounded p-3 hover:bg-gray-50"
            >
              <p className="font-bold">{bookmark.title}</p>
              <p className="text-sm text-gray-600">{bookmark.description}</p>
              <p className="text-xs text-gray-500">{bookmark.url}</p>
              <span className="text-xs text-gray-500">
                Collection: {bookmark.collection_title}
              </span>
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
}

export default BookmarkList;
