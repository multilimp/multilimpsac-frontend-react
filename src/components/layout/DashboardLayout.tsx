
import React from "react";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";
import { useAuthStore } from "@/store/authStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isLoading } = useAuthStore(state => ({ 
    isLoading: state.isLoading 
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-multilimp-green text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav />
        <div className="flex flex-col flex-1">
          <TopBar />
          <SidebarTrigger className="lg:hidden ml-4 mt-4" />
          <main className="flex-1 p-4 lg:p-6 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
