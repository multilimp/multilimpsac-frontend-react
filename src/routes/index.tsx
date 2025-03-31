// src/routes/index.tsx
import { Routes } from "react-router-dom";
import { RouteRenderer } from "./RouteRenderer";
import { allRoutes } from "./config";

export const AppRoutes = () => {
  return (
    <Routes>
      <RouteRenderer routes={allRoutes} />
    </Routes>
  );
};

// Exportar todo lo necesario para la navegación
export * from "./config";
export * from "./types";