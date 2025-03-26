
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { useAuthStore } from "@/store/authStore";
import MenuGroup from "./sidebar/MenuGroup";
import SubNavGroup from "./sidebar/SubNavGroup";
import SidebarFooterSection from "./sidebar/SidebarFooterSection";
import { 
  menuGroups, 
  processesSubNav, 
  reportsSubNav, 
  profileSubNav 
} from "./sidebar/navigationData";

const SidebarNav = () => {
  const { user, logout } = useAuthStore(state => ({ 
    user: state.user,
    logout: state.logout 
  }));
  const [openSubNav, setOpenSubNav] = useState<string | null>("Procesos");

  const toggleSubNav = (label: string) => {
    setOpenSubNav(openSubNav === label ? null : label);
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-2">
        <Logo />
        <div className="text-sm text-center text-white/70 mt-1">Sistema ERP</div>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <MenuGroup 
            key={group.label} 
            label={group.label} 
            items={group.items} 
          />
        ))}
        
        <div className="px-3 py-2">
          <SubNavGroup
            label={processesSubNav.label}
            icon={processesSubNav.icon}
            items={processesSubNav.items}
            isOpen={openSubNav === processesSubNav.label}
            onToggle={toggleSubNav}
          />
          
          <SubNavGroup
            label={reportsSubNav.label}
            icon={reportsSubNav.icon}
            items={reportsSubNav.items}
            isOpen={openSubNav === reportsSubNav.label}
            onToggle={toggleSubNav}
          />
          
          <SubNavGroup
            label={profileSubNav.label}
            icon={profileSubNav.icon}
            items={profileSubNav.items}
            isOpen={openSubNav === profileSubNav.label}
            onToggle={toggleSubNav}
          />
        </div>
      </SidebarContent>
      
      <SidebarFooterSection user={user} logout={logout} />
    </Sidebar>
  );
};

export default SidebarNav;
