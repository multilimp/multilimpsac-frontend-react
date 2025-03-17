
import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useSecondaryNav } from "@/contexts/SecondaryNavContext";
import SecondaryNavbar from "./SecondaryNavbar";

interface PageWithSecondaryNavProps {
  children: React.ReactNode;
}

const PageWithSecondaryNav: React.FC<PageWithSecondaryNavProps> = ({ children }) => {
  const { navItems, navTitle } = useSecondaryNav();

  const secondaryNav = navItems.length > 0 ? (
    <SecondaryNavbar items={navItems} title={navTitle} />
  ) : null;

  return (
    <DashboardLayout secondaryNav={secondaryNav}>
      {children}
    </DashboardLayout>
  );
};

export default PageWithSecondaryNav;
