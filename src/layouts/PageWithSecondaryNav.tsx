
import React from "react";
import MainLayout from "./MainLayout";
import { useSecondaryNav } from "@/contexts/SecondaryNavContext";
import SecondaryNavbar from "@/components/layout/SecondaryNavbar";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";

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
    <MainLayout secondaryNav={secondaryNav}>
      {children}
    </MainLayout>
  );
};

export default PageWithSecondaryNav;
