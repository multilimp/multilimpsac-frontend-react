
import React from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User } from "@/store/authStore";

interface SidebarFooterSectionProps {
  user: User | null;
  logout: () => void;
}

const SidebarFooterSection: React.FC<SidebarFooterSectionProps> = ({ user, logout }) => {
  return (
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
  );
};

export default SidebarFooterSection;
