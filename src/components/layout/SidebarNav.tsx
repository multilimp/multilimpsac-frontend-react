
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Building,
  Users,
  Truck,
  ShoppingCart,
  ClipboardList,
  Package,
  FileSearch,
  BookOpen,
  CreditCard,
  ReceiptText,
  Settings,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { RequirePermission } from "@/core/utils/permissions";

interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
  permission: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
  isCollapsible?: boolean;
}

interface SubNavGroup {
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", path: "/", icon: BarChart3, permission: "view_dashboard" },
    ],
  },
  {
    label: "Directorio",
    items: [
      { title: "Empresas", path: "/empresas", icon: Building, permission: "manage_companies" },
      { title: "Clientes", path: "/clientes", icon: Users, permission: "manage_clients" },
      { title: "Proveedores", path: "/proveedores", icon: Users, permission: "manage_suppliers" },
      { title: "Transportes", path: "/transportes", icon: Truck, permission: "manage_transports" },
      { title: "Usuarios", path: "/usuarios", icon: Users, permission: "manage_users" },
    ],
  },
];

const processesSubNav: SubNavGroup = {
  label: "Procesos",
  icon: ClipboardList,
  items: [
    { title: "Cotizaciones", path: "/cotizaciones", icon: FileSearch, permission: "manage_quotes" },
    { title: "Ventas", path: "/ventas", icon: ShoppingCart, permission: "manage_sales" },
    { title: "Órdenes de Proveedores", path: "/ordenes", icon: Package, permission: "manage_orders" },
    { title: "Seguimiento de Órdenes", path: "/seguimiento", icon: ClipboardList, permission: "manage_tracking" },
    { title: "Tesorería", path: "/tesoreria", icon: CreditCard, permission: "manage_treasury" },
    { title: "Facturación", path: "/facturacion", icon: FileText, permission: "manage_billing" },
    { title: "Cobranzas", path: "/cobranzas", icon: ReceiptText, permission: "manage_collections" },
  ],
};

const reportsSubNav: SubNavGroup = {
  label: "Reportes",
  icon: BookOpen,
  items: [
    { title: "Ventas", path: "/reportes/ventas", icon: ShoppingCart, permission: "view_reports" },
    { title: "Cobranzas", path: "/reportes/cobranzas", icon: ReceiptText, permission: "view_reports" },
    { title: "Entregas OC", path: "/reportes/entregas", icon: Truck, permission: "view_reports" },
    { title: "Ranking", path: "/reportes/ranking", icon: BarChart3, permission: "view_reports" },
  ],
};

const profileSubNav: SubNavGroup = {
  label: "Usuario",
  icon: User,
  items: [
    { title: "Perfil", path: "/perfil", icon: User, permission: "view_dashboard" },
    { title: "Configuración", path: "/configuracion", icon: Settings, permission: "view_dashboard" },
  ],
};

const SidebarNav = () => {
  const { user, logout } = useAuthStore(state => ({ 
    user: state.user,
    logout: state.logout 
  }));
  const [openSubNav, setOpenSubNav] = useState<string | null>("Procesos");

  const toggleSubNav = (label: string) => {
    setOpenSubNav(openSubNav === label ? null : label);
  };

  const renderSubNav = (subNav: SubNavGroup) => {
    const isOpen = openSubNav === subNav.label;
    
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSubNav(subNav.label)}
          className="flex items-center justify-between w-full p-2 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <div className="flex items-center">
            <subNav.icon className="h-4 w-4 mr-2" />
            <span>{subNav.label}</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {isOpen && (
          <div className="pl-6 pt-1 space-y-1">
            {subNav.items.map((item) => (
              <RequirePermission key={item.path} permission={item.permission}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1 rounded-md text-sm ${
                      isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </NavLink>
              </RequirePermission>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-2">
        <Logo />
        <div className="text-sm text-center text-white/70 mt-1">Sistema ERP</div>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
        
        <div className="px-3 py-2">
          {renderSubNav(processesSubNav)}
          {renderSubNav(reportsSubNav)}
          {renderSubNav(profileSubNav)}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          {user && (
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
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
