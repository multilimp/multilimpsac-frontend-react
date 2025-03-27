
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { CompanyProvider } from "@/contexts/CompanyContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface QueryProvidersProps {
  children: ReactNode;
}

export function QueryProviders({ children }: QueryProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        {children}
      </CompanyProvider>
    </QueryClientProvider>
  );
}
