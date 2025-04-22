
import { MenuItem, MenuGroup } from "@/components/layout/DynamicSidebar";
import {
  BarChart3,
  FileText,
  Building,
  Users,
  Truck,
  ShoppingCart,
  FileSearch,
  Package,
  ClipboardList,
  CreditCard,
  Settings,
  User,
} from "lucide-react";

export const navigationGroups: MenuGroup[] = [
  {
    label: "Principal",
    routes: [
      { 
        label: "Dashboard", 
        path: "/", 
        icon: BarChart3,
        permission: "view_dashboard" 
      }
    ]
  },
  {
    label: "Directorio",
    routes: [
      { 
        label: "Empresas", 
        path: "/empresas", 
        icon: Building,
        permission: "manage_companies" 
      },
      { 
        label: "Clientes", 
        path: "/clientes", 
        icon: Users,
        permission: "manage_clients" 
      },
      { 
        label: "Proveedores", 
        path: "/proveedores", 
        icon: Users,
        permission: "manage_suppliers" 
      },
      { 
        label: "Transportes", 
        path: "/transportes", 
        icon: Truck,
        permission: "manage_transports" 
      }
    ]
  }
];

export const processesGroup: MenuGroup = {
  label: "Procesos",
  routes: [
    { 
      label: "Cotizaciones", 
      path: "/cotizaciones", 
      icon: FileSearch,
      permission: "manage_quotes" 
    },
    { 
      label: "Ventas", 
      path: "/ventas", 
      icon: ShoppingCart,
      permission: "manage_sales" 
    },
    { 
      label: "Órdenes", 
      path: "/ordenes", 
      icon: Package,
      permission: "manage_orders" 
    },
    { 
      label: "Seguimiento", 
      path: "/seguimiento", 
      icon: ClipboardList,
      permission: "manage_tracking" 
    },
    { 
      label: "Tesorería", 
      path: "/tesoreria", 
      icon: CreditCard,
      permission: "manage_treasury" 
    },
    { 
      label: "Facturación", 
      path: "/facturacion", 
      icon: FileText,
      permission: "manage_billing" 
    }
  ]
};

export const userGroup: MenuGroup = {
  label: "Usuario",
  routes: [
    { 
      label: "Perfil", 
      path: "/perfil", 
      icon: User,
      permission: "view_dashboard" 
    },
    { 
      label: "Configuración", 
      path: "/configuracion", 
      icon: Settings,
      permission: "view_dashboard" 
    }
  ]
};
