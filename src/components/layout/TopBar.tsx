import React from "react";
import { Bell, Search, User, Sidebar as SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { useAuth } from '@/features/auth';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const TopBar = () => {
  const { user } = useAuthStore(state => ({
    user: state.user
  }));
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión. Intente nuevamente.",
      });
    }
  };

  return (
    <div className="border-b bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center rounded-md border w-full max-w-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="mr-2 bg-multilimp-navy text-white hover:bg-multilimp-navy/80"
              >
                <SidebarIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1B2B41] text-white border-none w-72">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4">
                  <h2 className="text-xl font-semibold mb-4">Panel Secundario</h2>
                  {/* Contenido del sidebar secundario */}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Input
            type="text"
            placeholder="Buscar..."
            className="border-0 focus-visible:ring-0"
          />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <ConnectionStatus showText={false} className="mr-2" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-multilimp-green text-[10px] text-white">
              3
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-multilimp-navy flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role === "admin" ? "Administrador" : "Usuario"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/perfil")}>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/configuracion")}>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
