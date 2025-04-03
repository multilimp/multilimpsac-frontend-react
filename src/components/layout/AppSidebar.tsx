
import React from "react";
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
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import DynamicSidebar, { RouteGroup } from "./DynamicSidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const mainGroups: RouteGroup[] = [
  {
    label: "Principal",
    routes: [
      { label: "Dashboard", path: "/", icon: BarChart3, permission: "view_dashboard" },
    ],
  },
  {
    label: "Directorio",
    routes: [
      { label: "Empresas", path: "/empresas", icon: Building, permission: "manage_companies" },
      { label: "Clientes", path: "/clientes", icon: Users, permission: "manage_clients" },
      { label: "Proveedores", path: "/proveedores", icon: Users, permission: "manage_suppliers" },
      { label: "Transportes", path: "/transportes", icon: Truck, permission: "manage_transports" },
      { label: "Usuarios", path: "/usuarios", icon: Users, permission: "manage_users" },
    ],
  },
];

const dynamicGroups = {
  processes: {
    label: "Procesos",
    icon: ClipboardList,
    routes: [
      { label: "Cotizaciones", path: "/cotizaciones", icon: FileSearch, permission: "manage_quotes" },
      { label: "Ventas", path: "/ventas", icon: ShoppingCart, permission: "manage_sales" },
      { label: "Órdenes de Proveedores", path: "/ordenes", icon: Package, permission: "manage_orders" },
      { label: "Seguimiento de Órdenes", path: "/seguimiento", icon: ClipboardList, permission: "manage_tracking" },
      { label: "Tesorería", path: "/tesoreria", icon: CreditCard, permission: "manage_treasury" },
      { label: "Facturación", path: "/facturacion", icon: FileText, permission: "manage_billing" },
      { label: "Cobranzas", path: "/cobranzas", icon: ReceiptText, permission: "manage_collections" },
    ],
  },
  reports: {
    label: "Reportes",
    icon: BookOpen,
    routes: [
      { label: "Ventas", path: "/reportes/ventas", icon: ShoppingCart, permission: "view_reports" },
      { label: "Cobranzas", path: "/reportes/cobranzas", icon: ReceiptText, permission: "view_reports" },
      { label: "Entregas OC", path: "/reportes/entregas", icon: Truck, permission: "view_reports" },
      { label: "Ranking", path: "/reportes/ranking", icon: BarChart3, permission: "view_reports" },
    ],
  },
  user: {
    label: "Usuario",
    icon: User,
    routes: [
      { label: "Perfil", path: "/perfil", icon: User, permission: "view_dashboard" },
      { label: "Configuración", path: "/configuracion", icon: Settings, permission: "view_dashboard" },
    ],
  },
};

const SidebarToggleButton = () => {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="rounded-full bg-sidebar-background text-white"
    >
      {open ? (
        <PanelLeftClose className="h-3 w-3" />
      ) : (
        <PanelLeftOpen className="h-3 w-3" />
      )}
    </Button>
  );
};

const AppSidebar: React.FC = () => {
  return (
    <>
      <DynamicSidebar 
        groups={mainGroups} 
        dynamicGroups={dynamicGroups} 
      />
      <SidebarToggleButton />
    </>
  );
};

export default AppSidebar;
