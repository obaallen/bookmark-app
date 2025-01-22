import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import BookmarkCard from "../components/BookmarkCard";
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
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCollectionsMock().then((data) => setCollections(data));
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newCollections = Array.from(collections);
    const [moved] = newCollections.splice(result.source.index, 1);
    newCollections.splice(result.destination.index, 0, moved);

    setCollections(newCollections);
  };

  const handleDeleteBookmark = (bookmarkId, collectionId) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, bookmarks: col.bookmarks.filter((bm) => bm.id !== bookmarkId) }
          : col
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Bookmarks</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Bookmark
        </button>
      </div>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="collections-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
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
                      {/* Collection Header */}
                      <div className="flex justify-between mb-3" {...provided.dragHandleProps}>
                        <h2 className="text-xl font-semibold">{collection.name}</h2>
                      </div>
                      {/* Bookmarks Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {collection.bookmarks.map((bookmark) => (
                          <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            onDelete={(bookmarkId) =>
                              handleDeleteBookmark(bookmarkId, collection.id)
                            }
                          />
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

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <AddBookmarkModal
          onClose={() => setShowAddModal(false)}
          onSave={(newBookmark, collectionName) => {
            // Handle adding a new bookmark
            if (collectionName) {
              const newCollection = {
                id: Date.now(),
                name: collectionName,
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
          }}
        />
      )}
    </div>
  );
}
