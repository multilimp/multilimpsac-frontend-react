
import React, { useEffect, ReactNode } from "react";
import { useSecondaryNav } from "@/contexts/SecondaryNavContext";
import SecondaryNavbar from "./SecondaryNavbar";

interface SecondaryNavWrapperProps {
  navItems: { label: string; path: string; icon?: React.ElementType }[];
  title?: string;
  children: ReactNode;
}

const SecondaryNavWrapper: React.FC<SecondaryNavWrapperProps> = ({
  navItems,
  title,
  children,
}) => {
  const { setSecondaryNav, clearSecondaryNav } = useSecondaryNav();

  useEffect(() => {
    setSecondaryNav(navItems, title);

    return () => {
      clearSecondaryNav();
    };
  }, [navItems, title, setSecondaryNav, clearSecondaryNav]);

  return <>{children}</>;
};

export default SecondaryNavWrapper;
