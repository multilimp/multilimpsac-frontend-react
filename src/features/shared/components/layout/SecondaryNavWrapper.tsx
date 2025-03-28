
import React, { useEffect, ReactNode } from "react";
import { useSecondaryNav } from "@/contexts/SecondaryNavContext";
import SecondaryNavbar from "./SecondaryNavbar";

interface SecondaryNavWrapperProps {
  navItems: { label: string; path: string; icon?: React.ElementType }[];
  title?: string;
  children: ReactNode;
  showSecondaryNav?: boolean;
}

const SecondaryNavWrapper: React.FC<SecondaryNavWrapperProps> = ({
  navItems,
  title,
  children,
  showSecondaryNav = true,
}) => {
  const { setSecondaryNav, clearSecondaryNav } = useSecondaryNav();

  useEffect(() => {
    if (showSecondaryNav) {
      setSecondaryNav(navItems, title);
    } else {
      clearSecondaryNav();
    }

    return () => {
      clearSecondaryNav();
    };
  }, [navItems, title, setSecondaryNav, clearSecondaryNav, showSecondaryNav]);

  return <>{children}</>;
};

export default SecondaryNavWrapper;
