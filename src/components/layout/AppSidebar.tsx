
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";
import SidebarSection from "@/features/layout/components/SidebarSection";
import { navigationGroups, processesGroup, userGroup } from "@/features/layout/data/navigationData";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-2">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent>
        {navigationGroups.map((group, index) => (
          <SidebarSection key={group.label} group={group} />
        ))}
        
        <Separator className="my-2 bg-sidebar-border/50" />
        
        <SidebarSection group={processesGroup} />
        
        <Separator className="my-2 bg-sidebar-border/50" />
        
        <SidebarSection group={userGroup} />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 text-xs text-white/70 text-center">
          © {new Date().getFullYear()} MultilimpSAC
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
