
import React from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", path: "/", icon: BarChart3 },
    ],
  },
  {
    label: "Directorio",
    items: [
      { title: "Empresas", path: "/empresas", icon: Building },
      { title: "Clientes", path: "/clientes", icon: Users },
      { title: "Proveedores", path: "/proveedores", icon: Users },
      { title: "Transportes", path: "/transportes", icon: Truck },
      { title: "Usuarios", path: "/usuarios", icon: Users },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { title: "Cotizaciones", path: "/cotizaciones", icon: FileSearch },
      { title: "Ventas", path: "/ventas", icon: ShoppingCart },
      { title: "Órdenes de Proveedores", path: "/ordenes", icon: Package },
      { title: "Seguimiento de Órdenes", path: "/seguimiento", icon: ClipboardList },
    ],
  },
  {
    label: "Finanzas",
    items: [
      { title: "Tesorería", path: "/tesoreria", icon: CreditCard },
      { title: "Facturación", path: "/facturacion", icon: FileText },
      { title: "Cobranzas", path: "/cobranzas", icon: ReceiptText },
    ],
  },
  {
    label: "Informes",
    items: [
      { title: "Reportes", path: "/reportes", icon: BookOpen },
    ],
  },
];

const SidebarNav = () => {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-2">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
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
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
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
