
import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useSecondaryNav } from "@/contexts/SecondaryNavContext";
import SecondaryNavbar from "./SecondaryNavbar";
import BreadcrumbNav from "./BreadcrumbNav";

interface PageWithSecondaryNavProps {
  children: React.ReactNode;
}

const PageWithSecondaryNav: React.FC<PageWithSecondaryNavProps> = ({ children }) => {
  const { navItems, navTitle } = useSecondaryNav();

  const secondaryNav = (
    <>
      <BreadcrumbNav />
      {navItems.length > 0 && <SecondaryNavbar items={navItems} title={navTitle} />}
    </>
  );

  return (
    <DashboardLayout secondaryNav={secondaryNav}>
      {children}
    </DashboardLayout>
  );
};

export default PageWithSecondaryNav;
