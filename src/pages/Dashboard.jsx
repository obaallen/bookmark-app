import React from "react";
import BookmarkList from "../components/BookmarkList";
import AddBookmarkForm from "../components/AddBookmarkForm";
import RecentCollections from "../components/RecentCollections";

function Dashboard() {
  // Later, you might fetch the user’s bookmarks here
  // or manage them via a global state/context

  return (
    <div className="min-h-screen p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddBookmarkForm />
        <BookmarkList />
      </div>
      <div>
        {/* Recent Collections Section */}
        <RecentCollections />

        {/* Other sections like notes, todo, etc. */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold">Other Dashboard Section</h2>
          <p className="text-sm text-gray-600">
            Placeholder for additional dashboard content.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
