import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", 
    port: 5173, 
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // Flask backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Strip the /api prefix
      },
    },
  },
});
