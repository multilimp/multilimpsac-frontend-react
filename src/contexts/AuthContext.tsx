
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore, User } from '@/store/authStore';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createUser: (email: string, password: string, name: string, role: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  
  const { 
    user, isAuthenticated, isLoading, 
    setUser, setAuthenticated, setLoading,
    hasPermission
  } = useAuthStore();

  // Inicializar la sesión y configurar el listener de cambios de autenticación
  useEffect(() => {
    // Primero, obtener la sesión actual
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Verificar si existe una sesión activa
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (profile) {
            setUser({
              id: currentSession.user.id,
              name: profile.name || currentSession.user.email?.split('@')[0] || 'Usuario',
              email: currentSession.user.email || '',
              role: profile.role as 'admin' | 'user' | 'manager',
              avatar: profile.avatar,
              permissions: getRolePermissions(profile.role)
            });
            setAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Configurar el listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();

          if (profile) {
            setUser({
              id: newSession.user.id,
              name: profile.name || newSession.user.email?.split('@')[0] || 'Usuario',
              email: newSession.user.email || '',
              role: profile.role as 'admin' | 'user' | 'manager',
              avatar: profile.avatar,
              permissions: getRolePermissions(profile.role)
            });
            setAuthenticated(true);
          }
        } catch (error) {
          console.error('Error al cargar el perfil del usuario:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoading, setAuthenticated, setUser]);

  // Función para obtener los permisos según el rol
  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return [
          "view_dashboard", "manage_users", "manage_companies", "manage_clients", 
          "manage_suppliers", "manage_transports", "manage_quotes", "manage_sales", 
          "manage_orders", "manage_treasury", "manage_tracking", "manage_billing", 
          "manage_collections", "view_reports"
        ];
      case 'user':
        return [
          "view_dashboard", "manage_companies", "manage_clients", "manage_suppliers", 
          "manage_transports", "manage_quotes", "manage_sales", "manage_orders", 
          "manage_treasury", "manage_tracking", "manage_billing", "manage_collections", 
          "view_reports"
        ];
      case 'manager':
        return [
          "view_dashboard", "manage_clients", "manage_suppliers", "manage_quotes", 
          "manage_sales", "manage_orders", "view_reports"
        ];
      default:
        return ["view_dashboard"];
    }
  };

  // Función de inicio de sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // El perfil y estado de autenticación se actualizarán automáticamente a través del listener
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error.message || "Ha ocurrido un error durante el inicio de sesión",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de registro (para usuarios normales)
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registro exitoso",
        description: "Te has registrado correctamente. Verifica tu correo electrónico.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error.message || "Ha ocurrido un error durante el registro",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para que los administradores creen usuarios
  const createUser = async (email: string, password: string, name: string, role: string) => {
    if (!user || user.role !== 'admin') {
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "Solo los administradores pueden crear nuevos usuarios",
      });
      throw new Error("Solo los administradores pueden crear nuevos usuarios");
    }
    
    setLoading(true);
    
    try {
      // Usamos la API de Supabase para crear un nuevo usuario
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { email, password, name, role }
      });
      
      if (error) throw error;
      
      toast({
        title: "Usuario creado",
        description: `El usuario ${name} ha sido creado correctamente`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al crear usuario",
        description: error.message || "Ha ocurrido un error al crear el usuario",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de cierre de sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error.message || "Ha ocurrido un error al cerrar la sesión",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated, isLoading, session,
      hasPermission, login, logout, register, createUser 
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
