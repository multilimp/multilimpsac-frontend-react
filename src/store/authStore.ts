
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: string) => boolean;
}

// Permissions by role
const ROLE_PERMISSIONS = {
  admin: [
    "view_dashboard",
    "manage_users",
    "manage_companies",
    "manage_clients",
    "manage_suppliers",
    "manage_transports",
    "manage_quotes",
    "manage_sales",
    "manage_orders",
    "manage_treasury",
    "manage_tracking",
    "manage_billing",
    "manage_collections",
    "view_reports",
  ],
  user: [
    "view_dashboard",
    "manage_companies",
    "manage_clients",
    "manage_suppliers",
    "manage_transports",
    "manage_quotes",
    "manage_sales",
    "manage_orders",
    "manage_treasury",
    "manage_tracking",
    "manage_billing",
    "manage_collections",
    "view_reports",
  ],
  manager: [
    "view_dashboard",
    "manage_clients",
    "manage_suppliers",
    "manage_quotes",
    "manage_sales",
    "manage_orders",
    "view_reports",
  ],
};

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@multilimp.com",
    password: "admin123",
    role: "admin" as const,
    avatar: "",
    permissions: ROLE_PERMISSIONS.admin,
  },
  {
    id: "2",
    name: "Usuario Regular",
    email: "usuario@multilimp.com",
    password: "user123",
    role: "user" as const,
    avatar: "",
    permissions: ROLE_PERMISSIONS.user,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),
      login: async (email, password) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (!foundUser) {
          set({ isLoading: false });
          throw new Error("Credenciales incorrectas");
        }
        
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = foundUser;
        
        set({ 
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false 
        });
      },
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false 
        });
      },
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes(permission);
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
