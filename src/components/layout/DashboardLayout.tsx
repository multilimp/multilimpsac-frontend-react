
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "./TopBar";
import AppSidebar from "./AppSidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
  secondaryNav?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, secondaryNav }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <TopBar />
          {secondaryNav && (
            <div className="w-full">
              {secondaryNav}
            </div>
          )}
          <main className="flex-1 overflow-y-auto p-4">
            {children ? children : <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
