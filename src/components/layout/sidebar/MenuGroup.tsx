
import React from "react";
import { NavLink } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { RequirePermission } from "@/core/utils/permissions";

interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
  permission: string;
}

interface MenuGroupProps {
  label: string;
  items: MenuItem[];
}

const MenuGroup: React.FC<MenuGroupProps> = ({ label, items }) => {
  return (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <RequirePermission key={item.path} permission={item.permission}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent" : ""
                    }
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RequirePermission>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default MenuGroup;
