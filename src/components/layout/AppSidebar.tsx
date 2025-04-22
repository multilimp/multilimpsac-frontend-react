
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
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarSection } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ href, label, icon }) => (
  <NavLink
    to={href}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const SidebarToggleButton = () => {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="rounded-full bg-sidebar-background text-white absolute right-[-12px] top-5 z-50"
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
  const { user } = useAuthStore(state => ({ user: state.user }));
  
  return (
    <Sidebar className="relative">
      <div className="flex items-center h-14 px-4 border-b">
        <h1 className="text-lg font-semibold">ERP Multilimpo</h1>
      </div>
      
      <SidebarToggleButton />
      
      <div className="p-4 space-y-8 overflow-y-auto">
        <SidebarSection title="Principal">
          <SidebarNavItem
            href="/"
            label="Dashboard"
            icon={<BarChart3 className="h-4 w-4" />}
          />
        </SidebarSection>
        
        <SidebarSection title="Directorio">
          <SidebarNavItem
            href="/empresas"
            label="Empresas"
            icon={<Building className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/clientes"
            label="Clientes"
            icon={<Users className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/proveedores"
            label="Proveedores"
            icon={<Users className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/transportes"
            label="Transportes"
            icon={<Truck className="h-4 w-4" />}
          />
          {user?.role === "admin" && (
            <SidebarNavItem
              href="/usuarios"
              label="Usuarios"
              icon={<Users className="h-4 w-4" />}
            />
          )}
        </SidebarSection>
        
        <SidebarSection title="Procesos">
          <SidebarNavItem
            href="/cotizaciones"
            label="Cotizaciones"
            icon={<FileSearch className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/ventas"
            label="Ventas"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/ordenes"
            label="Órdenes de Proveedores"
            icon={<Package className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/seguimiento"
            label="Seguimiento de Órdenes"
            icon={<ClipboardList className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/tesoreria"
            label="Tesorería"
            icon={<CreditCard className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/facturacion"
            label="Facturación"
            icon={<FileText className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/cobranzas"
            label="Cobranzas"
            icon={<ReceiptText className="h-4 w-4" />}
          />
        </SidebarSection>
        
        <SidebarSection title="Reportes">
          <SidebarNavItem
            href="/reportes/ventas"
            label="Ventas"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/reportes/cobranzas"
            label="Cobranzas"
            icon={<ReceiptText className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/reportes/entregas"
            label="Entregas OC"
            icon={<Truck className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/reportes/ranking"
            label="Ranking"
            icon={<BarChart3 className="h-4 w-4" />}
          />
        </SidebarSection>
        
        <SidebarSection title="Usuario">
          <SidebarNavItem
            href="/perfil"
            label="Perfil"
            icon={<User className="h-4 w-4" />}
          />
          <SidebarNavItem
            href="/configuracion"
            label="Configuración"
            icon={<Settings className="h-4 w-4" />}
          />
        </SidebarSection>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
