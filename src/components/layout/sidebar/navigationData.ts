
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
} from "lucide-react";

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
  permission: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
  isCollapsible?: boolean;
}

export interface SubNavGroup {
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
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

export const processesSubNav: SubNavGroup = {
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

export const reportsSubNav: SubNavGroup = {
  label: "Reportes",
  icon: BookOpen,
  items: [
    { title: "Ventas", path: "/reportes/ventas", icon: ShoppingCart, permission: "view_reports" },
    { title: "Cobranzas", path: "/reportes/cobranzas", icon: ReceiptText, permission: "view_reports" },
    { title: "Entregas OC", path: "/reportes/entregas", icon: Truck, permission: "view_reports" },
    { title: "Ranking", path: "/reportes/ranking", icon: BarChart3, permission: "view_reports" },
  ],
};

export const profileSubNav: SubNavGroup = {
  label: "Usuario",
  icon: User,
  items: [
    { title: "Perfil", path: "/perfil", icon: User, permission: "view_dashboard" },
    { title: "Configuración", path: "/configuracion", icon: Settings, permission: "view_dashboard" },
  ],
};
