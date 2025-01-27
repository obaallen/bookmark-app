import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { authAPI } from "../services/api";

export default function Layout() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown if the user clicks outside
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

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    try {
      await authAPI.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white fixed top-0 left-0 flex flex-col justify-between h-screen">
        {/* Top Section */}
        <div>
          <div className="p-4 font-bold text-xl border-b border-gray-700">
            BookmarkHub
          </div>
          {/* Main Navigation */}
          <nav className="p-4 flex-grow">
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
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="relative border-t border-gray-700 p-4" ref={menuRef}>
          {/* Settings Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center w-full focus:outline-none"
          >
            <FaCog size={24} className="text-gray-400 mr-2" />
            <span className="font-medium">Settings</span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute bottom-16 left-0 w-full bg-white text-black rounded shadow-md">
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

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-gray-50 p-4">
        <Outlet />
      </main>
    </div>
  );
}
