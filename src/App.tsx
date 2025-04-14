
import { Suspense } from "react";
import { AppProviders } from "@/app/core/providers/AppProviders";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import { AppRoutes } from "./app/routes";
import { initializeAuthStore } from "./store/authStore";

// Inicializar el estado de autenticación
initializeAuthStore();

const App = () => {
  return (
    <AppProviders>
      <div className="app-container">
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </div>
    </AppProviders>
  );
};

export default App;
