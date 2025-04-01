
import React from "react";

export const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-multilimp-green text-lg">Cargando módulo...</div>
  </div>
);
