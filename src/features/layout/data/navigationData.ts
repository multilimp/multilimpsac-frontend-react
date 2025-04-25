import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  permission: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export const navigationGroups: MenuGroup[] = [
  {
    label: "Principal",
    items: [
      { 
        title: "Dashboard", 
        path: "/", 
        icon: BarChart3,
        permission: "view_dashboard" 
      }
    ]
  },
  {
    label: "Directorio",
    items: [
      { 
        title: "Empresas", 
        path: "/empresas", 
        icon: Building,
        permission: "manage_companies" 
      },
      { 
        title: "Clientes", 
        path: "/clientes", 
        icon: Users,
        permission: "manage_clients" 
      },
      { 
        title: "Proveedores", 
        path: "/proveedores", 
        icon: Users,
        permission: "manage_suppliers" 
      },
      { 
        title: "Transportes", 
        path: "/transportes", 
        icon: Truck,
        permission: "manage_transports" 
      }
    ]
  }
];

export const processesGroup: MenuGroup = {
  label: "Procesos",
  items: [
    { 
      title: "Cotizaciones", 
      path: "/cotizaciones", 
      icon: FileSearch,
      permission: "manage_quotes" 
    },
    { 
      title: "Ventas", 
      path: "/ventas", 
      icon: ShoppingCart,
      permission: "manage_sales" 
    },
    { 
      title: "Órdenes", 
      path: "/ordenes", 
      icon: Package,
      permission: "manage_orders" 
    },
    { 
      title: "Seguimiento", 
      path: "/seguimiento", 
      icon: ClipboardList,
      permission: "manage_tracking" 
    },
    { 
      title: "Tesorería", 
      path: "/tesoreria", 
      icon: CreditCard,
      permission: "manage_treasury" 
    },
    { 
      title: "Facturación", 
      path: "/facturacion", 
      icon: FileText,
      permission: "manage_billing" 
    }
  ]
};

export const userGroup: MenuGroup = {
  label: "Usuario",
  items: [
    { 
      title: "Perfil", 
      path: "/perfil", 
      icon: User,
      permission: "view_dashboard" 
    },
    { 
      title: "Configuración", 
      path: "/configuracion", 
      icon: Settings,
      permission: "view_dashboard" 
    }
  ]
};
