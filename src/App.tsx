
import { Suspense } from "react";
import { AppProviders } from "@/app/providers/AppProviders";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import { AppRoutes } from "./app/routes";

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
