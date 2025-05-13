
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::", // Esto hace que sea accesible desde la red local
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Group vendor modules into chunks to improve caching
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@mui/material',
            'antd'
          ],
        },
      },
    },
  },
}));
