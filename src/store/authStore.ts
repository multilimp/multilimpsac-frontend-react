import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

// Constante para habilitar/deshabilitar el modo demo
const DEMO_MODE = true;

// Export the User interface so it can be imported in other files
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  permissions: string[];
  roles?: string[]; 
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean; 
  logout: () => Promise<void>; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      hasPermission: (permission) => {
        // En modo demo, permitir todos los permisos
        if (DEMO_MODE) return true;
        
        const { user } = get();
        if (!user || !user.permissions) return false;
        
        // Verificar si el usuario tiene el permiso específico o el permiso comodín '*'
        return user.permissions.includes('*') || user.permissions.includes(permission);
      },
      hasRole: (role) => {
        // En modo demo, permitir todos los roles
        if (DEMO_MODE) return true;
        
        const { user } = get();
        if (!user) return false;
        
        if (user.roles && Array.isArray(user.roles)) {
          return user.roles.includes(role) || user.roles.includes('admin');
        }
        
        return user.role === role || user.role === 'admin';
      },
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      }
    }),
    {
      name: "multilimp-auth-storage",
    }
  )
);

export const initializeAuthStore = () => {
  const { setLoading } = useAuthStore.getState();
  setTimeout(() => setLoading(false), 500);
};
