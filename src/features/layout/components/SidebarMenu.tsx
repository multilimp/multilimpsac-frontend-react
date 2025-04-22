
import React from "react";
import { NavLink } from "react-router-dom";
import { MenuItem } from "@/components/layout/DynamicSidebar";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu as SMenu,
} from "@/components/ui/sidebar";
import { RequirePermission } from "@/core/utils/permissions";
import { cn } from "@/app/core/utils";

interface SidebarMenuProps {
  items: MenuItem[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  return (
    <SMenu>
      {items.map((item) => (
        <RequirePermission key={item.path} permission={item.permission}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(isActive ? "bg-sidebar-accent" : "")
                }
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </RequirePermission>
      ))}
    </SMenu>
  );
};

export default SidebarMenu;
