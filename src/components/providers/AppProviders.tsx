
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecondaryNavProvider } from "@/contexts/SecondaryNavContext";

// Create a query client
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SecondaryNavProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </SecondaryNavProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
