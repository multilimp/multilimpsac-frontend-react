
import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface SecondaryNavContextType {
  navItems: NavItem[];
  navTitle: string | undefined;
  setSecondaryNav: (items: NavItem[], title?: string) => void;
  clearSecondaryNav: () => void;
}

const SecondaryNavContext = createContext<SecondaryNavContextType | undefined>(undefined);

export const SecondaryNavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [navTitle, setNavTitle] = useState<string | undefined>(undefined);

  const setSecondaryNav = (items: NavItem[], title?: string) => {
    setNavItems(items);
    setNavTitle(title);
  };

  const clearSecondaryNav = () => {
    setNavItems([]);
    setNavTitle(undefined);
  };

  return (
    <SecondaryNavContext.Provider value={{ navItems, navTitle, setSecondaryNav, clearSecondaryNav }}>
      {children}
    </SecondaryNavContext.Provider>
  );
};

export const useSecondaryNav = () => {
  const context = useContext(SecondaryNavContext);
  if (context === undefined) {
    throw new Error("useSecondaryNav must be used within a SecondaryNavProvider");
  }
  return context;
};
