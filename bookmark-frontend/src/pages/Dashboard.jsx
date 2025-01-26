import React from "react";
import BookmarkList from "../components/BookmarkList";
import AddBookmarkForm from "../components/AddBookmarkForm";
import RecentCollections from "../components/RecentCollections";

function Dashboard() {

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
      </div>
    </div>
  );
}

export default Dashboard;
