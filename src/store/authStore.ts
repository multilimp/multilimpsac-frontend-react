
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

// Export the User interface so it can be imported in other files
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  avatar?: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: string) => boolean;
  logout: () => Promise<void>; // Añadimos la función de logout
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
        const { user } = get();
        // Protección contra null y undefined
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
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

// Initialize loading state
export const initializeAuthStore = () => {
  const { setLoading } = useAuthStore.getState();
  // Set loading to false after initial hydration is complete
  setTimeout(() => setLoading(false), 500);
};
