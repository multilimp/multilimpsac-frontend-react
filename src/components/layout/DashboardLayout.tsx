
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TopBar from "./TopBar";
import AppSidebar from "./AppSidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
  secondaryNav?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, secondaryNav }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-background">
          <TopBar />
          {secondaryNav && (
            <div className="w-full">
              {secondaryNav}
            </div>
          )}
          <main className="flex-1 overflow-y-auto p-4">
            {children ? children : <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
