
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("multilimp-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Credenciales incorrectas");
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem("multilimp-user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${userWithoutPassword.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error instanceof Error ? error.message : "Ocurrió un error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("multilimp-user");
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
