import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),  // solo el plugin oficial de React
  ],
  server: {
    host: "::", // accesible desde la red local
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // aumentar límite de advertencia
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@mui/material",
            "antd",
          ],
        },
      },
    },
  },
}));
