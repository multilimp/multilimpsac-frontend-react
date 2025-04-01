
import { Suspense } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import { AppRoutes } from "./routes";
import { initializeAuthStore } from "./store/authStore";

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
