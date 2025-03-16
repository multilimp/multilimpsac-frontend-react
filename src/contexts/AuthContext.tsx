import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ReturnType<typeof useAuthStore.getState>["user"];
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Usar el zustand store directamente
  const { 
    user, isAuthenticated, isLoading, 
    hasPermission, login, logout 
  } = useAuthStore();

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated, isLoading, 
      hasPermission, login, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};