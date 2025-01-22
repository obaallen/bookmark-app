const config = {
  API_BASE_URL:
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:5000" // Use the /api prefix for development
      : "", // Use relative URL for production
};

export default config;
