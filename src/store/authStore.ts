
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@multilimp.com",
    password: "admin123",
    role: "admin" as const,
    avatar: "",
  },
  {
    id: "2",
    name: "Usuario Regular",
    email: "usuario@multilimp.com",
    password: "user123",
    role: "user" as const,
    avatar: "",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
