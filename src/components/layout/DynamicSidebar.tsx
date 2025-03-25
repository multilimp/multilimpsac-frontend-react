
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { RequirePermission } from "@/core/utils/permissions";

export interface Route {
  label: string;
  path: string;
  icon?: React.ElementType;
  permission?: string;
}

export interface RouteGroup {
  label: string;
  routes: Route[];
  isCollapsible?: boolean;
}

interface DynamicSidebarProps {
  groups: RouteGroup[];
  dynamicGroups?: {
    [key: string]: {
      label: string;
      icon: React.ElementType;
      routes: Route[];
    };
  };
}

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ groups, dynamicGroups = {} }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore(state => ({ 
    user: state.user,
    logout: state.logout 
  }));
  
  const { open } = useSidebar();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Initialize with all dynamic groups closed except the active one
    const initial: Record<string, boolean> = {};
    Object.keys(dynamicGroups).forEach(key => {
      const groupRoutes = dynamicGroups[key].routes;
      const isActive = groupRoutes.some(route => location.pathname === route.path);
      initial[key] = isActive;
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };
  
  const isRouteActive = (path: string) => {
    return location.pathname === path;
  };

  const renderDynamicGroup = (key: string, group: { label: string; icon: React.ElementType; routes: Route[] }) => {
    const isOpen = openGroups[key] || false;
    
    return (
      <div className="mb-2 transition-all duration-200" key={key}>
        <button
          onClick={() => toggleGroup(key)}
          className={cn(
            "flex items-center justify-between w-full p-2 rounded-md transition-colors",
            "hover:bg-sidebar-accent/70",
            isOpen && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <div className="flex items-center">
            <group.icon className="h-4 w-4 mr-2" />
            <span className={cn(open ? "opacity-100" : "opacity-0 md:hidden")}>{group.label}</span>
          </div>
          {open && (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
        </button>
        
        {open && (
          <div 
            className={cn(
              "pl-6 pt-1 space-y-1 overflow-hidden transition-all duration-200",
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {group.routes.map((route) => (
              <RequirePermission key={route.path} permission={route.permission || "view_dashboard"}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-2 py-1 rounded-md text-sm transition-colors",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )
                  }
                >
                  {route.icon && <route.icon className="h-4 w-4 mr-2" />}
                  <span>{route.label}</span>
                </NavLink>
              </RequirePermission>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-4 px-2">
        <Logo />
        {open && (
          <div className="text-sm text-center text-white/70 mt-1">Sistema ERP</div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {open && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.routes.map((route) => (
                  <RequirePermission key={route.path} permission={route.permission || "view_dashboard"}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={!open ? route.label : undefined}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) =>
                            cn(isActive ? "bg-sidebar-accent" : "")
                          }
                        >
                          {route.icon && <route.icon className="h-4 w-4 mr-2" />}
                          {open && <span>{route.label}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </RequirePermission>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        <Separator className="my-2 bg-sidebar-border/50" />
        
        <div className="px-3 py-2 space-y-2">
          {Object.keys(dynamicGroups).map(key => 
            renderDynamicGroup(key, dynamicGroups[key])
          )}
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          {user && open && (
            <div className="mb-3 text-xs text-white/70 px-2">
              Sesión: <span className="font-medium text-white">{user.name}</span>
              <div className="text-xs text-white/50">
                Rol: {user.role === "admin" ? "Administrador" : "Usuario"}
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={logout} 
            className="w-full flex items-center justify-center"
          >
            {open ? <span>Cerrar Sesión</span> : <span>Salir</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DynamicSidebar;
