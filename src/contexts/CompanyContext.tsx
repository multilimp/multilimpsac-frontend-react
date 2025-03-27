
import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "@/data/services/companyService";
import { Company } from "@/data/models/company";

interface CompanyContextProps {
  companies: Company[];
  isLoading: boolean;
  refetch: () => Promise<any>;
}

const CompanyContext = createContext<CompanyContextProps | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { 
    data = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  return (
    <CompanyContext.Provider value={{ companies: data, isLoading, refetch }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanies must be used within a CompanyProvider");
  }
  return context;
}
