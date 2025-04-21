
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Company } from "@/features/entities/company/models/company.model";

interface CompanyContextType {
  currentCompany: Company | null;
  setCurrentCompany: (company: Company | null) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);

  return (
    <CompanyContext.Provider value={{ currentCompany, setCurrentCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
