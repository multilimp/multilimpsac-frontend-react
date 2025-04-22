
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
  CreditCard,
  ReceiptText,
  Settings,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar, Sidebar, SidebarGroup, SidebarGroupLabel, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/app/core/utils";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";

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
  const { open } = useSidebar();
  
  return (
    <Sidebar className="relative">
      <div className="flex items-center h-14 px-4 border-b">
        <h1 className="text-lg font-semibold">ERP Multilimpo</h1>
      </div>
      
      <SidebarToggleButton />
      
      <SidebarContent>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Principal</SidebarGroupLabel>}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Dashboard" : undefined}>
                <NavLink to="/">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {open && <span>Dashboard</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          {open && <SidebarGroupLabel>Directorio</SidebarGroupLabel>}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Empresas" : undefined}>
                <NavLink to="/empresas">
                  <Building className="h-4 w-4 mr-2" />
                  {open && <span>Empresas</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Clientes" : undefined}>
                <NavLink to="/clientes">
                  <Users className="h-4 w-4 mr-2" />
                  {open && <span>Clientes</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Proveedores" : undefined}>
                <NavLink to="/proveedores">
                  <Users className="h-4 w-4 mr-2" />
                  {open && <span>Proveedores</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Transportes" : undefined}>
                <NavLink to="/transportes">
                  <Truck className="h-4 w-4 mr-2" />
                  {open && <span>Transportes</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {user?.role === "admin" && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={!open ? "Usuarios" : undefined}>
                  <NavLink to="/usuarios">
                    <Users className="h-4 w-4 mr-2" />
                    {open && <span>Usuarios</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
        
        <Separator className="my-2" />
        
        <SidebarGroup>
          {open && <SidebarGroupLabel>Procesos</SidebarGroupLabel>}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Cotizaciones" : undefined}>
                <NavLink to="/cotizaciones">
                  <FileSearch className="h-4 w-4 mr-2" />
                  {open && <span>Cotizaciones</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Ventas" : undefined}>
                <NavLink to="/ventas">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {open && <span>Ventas</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Órdenes" : undefined}>
                <NavLink to="/ordenes">
                  <Package className="h-4 w-4 mr-2" />
                  {open && <span>Órdenes de Proveedores</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Seguimiento" : undefined}>
                <NavLink to="/seguimiento">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {open && <span>Seguimiento de Órdenes</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Tesorería" : undefined}>
                <NavLink to="/tesoreria">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {open && <span>Tesorería</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Facturación" : undefined}>
                <NavLink to="/facturacion">
                  <FileText className="h-4 w-4 mr-2" />
                  {open && <span>Facturación</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          {open && <SidebarGroupLabel>Usuario</SidebarGroupLabel>}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Perfil" : undefined}>
                <NavLink to="/perfil">
                  <User className="h-4 w-4 mr-2" />
                  {open && <span>Perfil</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={!open ? "Configuración" : undefined}>
                <NavLink to="/configuracion">
                  <Settings className="h-4 w-4 mr-2" />
                  {open && <span>Configuración</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
