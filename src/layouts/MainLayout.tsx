
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TopBar from "@/components/layout/TopBar";
import AppSidebar from "@/components/layout/AppSidebar";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { useAuthStore } from "@/store/authStore";

interface MainLayoutProps {
  children?: ReactNode;
  secondaryNav?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, secondaryNav }) => {
  const { user } = useAuthStore(state => ({ user: state.user }));

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          {/* Floating connection status */}
          <div className="fixed bottom-4 right-4 z-50">
            <ConnectionStatus showText={true} className="shadow-lg" />
          </div>
          
          {secondaryNav && (
            <div className="w-full">
              {secondaryNav}
            </div>
          )}
          
          <main className="flex-1 overflow-y-auto p-4">
            {children ? children : <Outlet />}
          </main>
          
          <footer className="p-4 border-t text-sm text-muted-foreground text-center">
            <p>© {new Date().getFullYear()} MultilimpSAC - Sistema ERP</p>
            {user?.role === "admin" && (
              <div className="text-xs mt-1 text-muted-foreground/60">
                Versión: 1.0.0 - Usuario: {user?.name}
              </div>
            )}
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
