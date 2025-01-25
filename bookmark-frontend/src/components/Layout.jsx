import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  // Toggle for dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Reference to the dropdown menu container
  const menuRef = useRef(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Example logout handler
  const handleLogout = async () => {
    // Clear any auth token
    localStorage.removeItem("authToken");
    try {
      const response = await fetch('http://127.0.0.1:5000/logout', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include', 
      });

      if (response.ok) {
        navigate("/login");
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
        {/* Top: Logo or Title */}
        <div>
          <div className="p-4 font-bold text-xl border-b border-gray-700">
            My Bookmark App
          </div>
          {/* Main Navigation */}
          <nav className="p-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block mb-2 px-2 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `block mb-2 px-2 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Collections
            </NavLink>

            {/* Updated: "Teams" replaced by "Bookmarks" */}
            <NavLink
              to="/all-bookmarks"
              className={({ isActive }) =>
                `block mb-2 px-2 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Bookmarks
            </NavLink>

            <NavLink
              to="/collections/new"
              className={({ isActive }) =>
                `block mb-2 px-2 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              + New Collection
            </NavLink>
          </nav>
        </div>

        {/* Bottom: User Info & Dropdown Menu */}
        <div className="relative border-t border-gray-700 p-4" ref={menuRef}>
          {/* User Avatar + Name */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center w-full focus:outline-none"
          >
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="rounded-full w-10 h-10 mr-2"
            />
            <span className="font-medium">John Doe</span>
            {/* Optional: Add a small dropdown icon here */}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute bottom-16 left-0 w-full bg-white text-black rounded shadow-md">
              {/* My Account */}
              <NavLink
                to="/account"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                My Account
              </NavLink>
              {/* Settings */}
              <NavLink
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </NavLink>
              {/* Logout */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 bg-gray-50 p-4">
        <Outlet />
      </main>
    </div>
  );
}
