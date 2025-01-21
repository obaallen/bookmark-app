import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import EditBookmarkModal from "../components/EditBookmarkModal";
import AddBookmarkModal from "../components/AddBookmarkModal";

// Example mock function to fetch collections with bookmarks
async function fetchCollectionsMock() {
  return [
    {
      id: 1,
      name: "Recipes",
      bookmarks: [
        {
          id: 101,
          url: "https://cookingblog.com/pizza",
          title: "Pizza Recipe",
          description: "Delicious homemade pizza guide",
        },
        {
          id: 102,
          url: "https://cookingblog.com/pasta",
          title: "Pasta Recipe",
          description: "Easy pasta dish ideas",
        },
      ],
    },
    {
      id: 2,
      name: "News",
      bookmarks: [
        {
          id: 201,
          url: "https://newswebsite.com/technology",
          title: "Tech News",
          description: "Latest technology updates",
        },
      ],
    },
  ];
}

export default function AllBookmarks() {
  const [collections, setCollections] = useState([]);
  const [editingBookmark, setEditingBookmark] = useState(null);

  // For showing/hiding the "Add Bookmark" modal
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Fetch collections from API or mock
    fetchCollectionsMock().then((data) => setCollections(data));
  }, []);

  // ===============================
  // DRAG-AND-DROP HANDLERS
  // ===============================
  const handleDragEnd = (result) => {
    // If user drops outside a valid area or no destination
    if (!result.destination) return;

    // Reorder collections array
    const newCollections = Array.from(collections);
    const [moved] = newCollections.splice(result.source.index, 1);
    newCollections.splice(result.destination.index, 0, moved);

    setCollections(newCollections);
  };

  // ===============================
  // EDIT BOOKMARK HANDLERS
  // ===============================
  const handleEditClick = (bookmark, e) => {
    e.stopPropagation();
    setEditingBookmark(bookmark);
  };

  const handleCloseEditModal = () => {
    setEditingBookmark(null);
  };

  const handleSaveBookmark = (updatedBookmark) => {
    setCollections((prev) =>
      prev.map((col) => ({
        ...col,
        bookmarks: col.bookmarks.map((bm) =>
          bm.id === updatedBookmark.id ? updatedBookmark : bm
        ),
      }))
    );
    setEditingBookmark(null);
  };

  // ===============================
  // ADD BOOKMARK HANDLERS
  // ===============================
  const handleAddBookmark = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleSaveNewBookmark = (newBookmark, newCollectionName) => {
    if (newCollectionName) {
      const newCollection = {
        id: Date.now(),
        name: newCollectionName,
        bookmarks: [newBookmark],
      };
      setCollections((prev) => [...prev, newCollection]);
    } else {
      setCollections((prev) =>
        prev.map((col) =>
          col.id === newBookmark.collectionId
            ? { ...col, bookmarks: [...col.bookmarks, newBookmark] }
            : col
        )
      );
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Bookmarks</h1>
        {/* Add Bookmark Button */}
        <button
          onClick={handleAddBookmark}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Bookmark
        </button>
      </div>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="collections-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-6"
            >
              {collections.map((collection, index) => (
                <Draggable
                  key={collection.id.toString()}
                  draggableId={collection.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={provided.draggableProps.style}
                      className="border-t border-gray-200 pt-4"
                    >
                      <div className="flex justify-between mb-3" {...provided.dragHandleProps}>
                        <h2 className="text-xl font-semibold">{collection.name}</h2>
                        <span className="text-sm text-gray-500">Drag to reorder</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {collection.bookmarks.map((bookmark) => (
                          <div
                            key={bookmark.id}
                            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg relative"
                            onClick={() => window.open(bookmark.url, "_blank")}
                          >
                            <h3 className="text-md font-semibold mb-1">
                              {bookmark.title || bookmark.url}
                            </h3>
                            <p className="text-sm text-gray-600">{bookmark.description}</p>
                            <button
                              onClick={(e) => handleEditClick(bookmark, e)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                              title="Edit Bookmark"
                            >
                              <FaPen size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Bookmark Modal */}
      {editingBookmark && (
        <EditBookmarkModal
          bookmark={editingBookmark}
          onClose={handleCloseEditModal}
          onSave={handleSaveBookmark}
          collections={collections} // Pass collections explicitly
        />
      )}

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <AddBookmarkModal
          collections={collections}
          onClose={handleCloseAddModal}
          onSave={handleSaveNewBookmark}
        />
      )}
    </div>
  );
}
