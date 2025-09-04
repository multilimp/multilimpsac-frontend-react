import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    force: true,
    exclude: [],
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "antd",
      "dayjs",
      "axios",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
            "antd",
          ],
          utils: [
            "dayjs",
            "axios",
          ],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
}));
