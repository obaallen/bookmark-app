import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import NewCollection from "./pages/NewCollection";
import AllBookmarks from "./pages/AllBookmarks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private routes (Layout with sidebar) */}
        <Route path="/" element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/new" element={<NewCollection />} />
          <Route path="collections/:collectionId" element={<CollectionDetail />} />
          <Route path="all-bookmarks" element={<AllBookmarks />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
