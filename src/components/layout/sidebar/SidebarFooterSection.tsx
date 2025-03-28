
import React, { useState } from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, ChevronRight } from "lucide-react";
import { User as UserType } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import SecondaryNavWrapper from "@/features/shared/components/layout/SecondaryNavWrapper";

interface SidebarFooterSectionProps {
  user: UserType | null;
  logout: () => void;
}

const SidebarFooterSection: React.FC<SidebarFooterSectionProps> = ({ user, logout }) => {
  const navigate = useNavigate();
  const [showUserOptions, setShowUserOptions] = useState(false);

  const userNavItems = [
    { label: "Perfil", path: "/perfil", icon: User },
    { label: "Configuración", path: "/configuracion", icon: Settings },
    { label: "Cerrar Sesión", path: "#", icon: LogOut },
  ];

  const handleUserButtonClick = () => {
    setShowUserOptions(!showUserOptions);
  };

  const handleNavItemClick = (path: string) => {
    if (path === "#") {
      logout();
    } else {
      navigate(path);
    }
    setShowUserOptions(false);
  };

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
          onClick={handleUserButtonClick} 
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Mi cuenta</span>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform ${showUserOptions ? 'rotate-90' : ''}`} />
        </Button>

        {showUserOptions && (
          <div className="mt-2 space-y-1 border rounded-md border-sidebar-accent p-1">
            {userNavItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleNavItemClick(item.path)}
                className="w-full flex items-center justify-start"
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </SidebarFooter>
  );
};

export default SidebarFooterSection;
