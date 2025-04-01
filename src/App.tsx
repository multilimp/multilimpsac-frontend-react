
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecondaryNavProvider } from "@/contexts/SecondaryNavContext";
import { initializeAuthStore } from "@/store/authStore";

// Import AppRoutes which uses our centralized route configuration
import { AppRoutes } from "./routes";

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-multilimp-green text-lg">Cargando módulo...</div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SecondaryNavProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="app-container">
                <Suspense fallback={<LoadingFallback />}>
                  <AppRoutes />
                </Suspense>
              </div>
            </BrowserRouter>
          </SecondaryNavProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
