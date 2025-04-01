
import { createContext, ReactNode, useEffect, useState } from 'react';
import { supabase, checkSupabaseConnection, checkTableAccess } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { 
  User, 
  DEMO_MODE, 
  DEMO_USER, 
  ConnectionStatus, 
  AuthContextType,
  ProfileData
} from '../types/auth.types';
import { createUserFromProfile, createBasicUser } from '../utils/auth.utils';
import { 
  loginService, 
  registerService, 
  createUserService, 
  logoutService, 
  refreshSessionService 
} from '../services/auth.service';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const { user, setUser, setAuthenticated } = useAuthStore();
  const { toast } = useToast();

  // Verificar la conexión a Supabase
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      setConnectionStatus('checking');
      
      try {
        // Si estamos en modo demo, inicializamos con el usuario demo
        if (DEMO_MODE) {
          console.log('Modo demo activado, usando credenciales demo');
          setUser(DEMO_USER);
          setAuthenticated(true);
          setConnectionStatus('connected');
          setLoading(false);
          return;
        }
        
        // Primero verificamos la conexión básica a Supabase
        const isConnected = await checkSupabaseConnection();
        
        if (!isConnected) {
          setConnectionStatus('disconnected');
          console.error("No se pudo conectar a Supabase");
          setLoading(false);
          return;
        }
        
        // Verificar acceso a tablas críticas
        const tablesStatus = await Promise.all([
          checkTableAccess('profiles'),
          checkTableAccess('clientes'),
        ]);
        
        const hasTableErrors = tablesStatus.some(status => !status.exists);
        
        if (hasTableErrors) {
          const errorTables = tablesStatus
            .filter(status => !status.exists)
            .map((_, index) => ['profiles', 'clientes'][index]);
          
          console.error(`Problemas accediendo a tablas: ${errorTables.join(', ')}`);
          
          // Si hay problemas con las tablas pero la conexión básica funciona,
          // seguimos intentando obtener la sesión pero marcamos como parcialmente conectado
          setConnectionStatus('connected');
          toast({
            variant: "default",
            title: "Advertencia",
            description: "Conexión parcial a la base de datos. Algunas funciones pueden estar limitadas.",
          });
        } else {
          setConnectionStatus('connected');
        }
        
        // Obtener la sesión actual
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error al obtener la sesión:", sessionError);
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        
        if (currentSession) {
          setSession(currentSession);
          
          try {
            // Obtener el perfil del usuario
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
            
            if (profileError) {
              console.error('Error al obtener el perfil del usuario:', profileError);
              
              // Si hay un error al obtener el perfil pero tenemos la sesión,
              // creamos un usuario con información básica
              const basicUser = createBasicUser(
                currentSession.user.id,
                currentSession.user.email,
                currentSession.user.user_metadata
              );
              
              setUser(basicUser);
              setAuthenticated(true);
              
              toast({
                variant: "default",
                title: "Advertencia",
                description: "Se cargó una sesión parcial. Algunas funciones pueden estar limitadas.",
              });
            } else if (profileData) {
              // Cast profileData to the correct type to access properties safely
              const typedProfile = profileData as ProfileData;
              
              // Crear el objeto de usuario con los datos del perfil
              const fullUser = createUserFromProfile(
                currentSession.user.id,
                currentSession.user.email,
                typedProfile,
                currentSession.user.user_metadata
              );
              
              setUser(fullUser);
              setAuthenticated(true);
            }
          } catch (error) {
            console.error('Error al procesar el perfil del usuario:', error);
            
            // Crear usuario básico en caso de error
            const basicUser = createBasicUser(
              currentSession.user.id,
              currentSession.user.email,
              currentSession.user.user_metadata
            );
            
            setUser(basicUser);
            setAuthenticated(true);
            
            toast({
              variant: "destructive",
              title: "Error",
              description: "Hubo un problema al cargar tu perfil. Algunas funciones pueden estar limitadas.",
            });
          }
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error en la inicialización de la autenticación:', error);
        setAuthenticated(false);
        
        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: "No se pudo inicializar la sesión. Intenta recargar la página.",
        });
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [toast, setUser, setAuthenticated]);

  // Inicializar la sesión y configurar el listener de cambios de autenticación
  useEffect(() => {
    // Si estamos en modo demo, no necesitamos configurar el listener
    if (DEMO_MODE) return;
    
    // Configurar el listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        
        try {
          // Obtener el perfil del usuario
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          
          if (profileError) {
            console.error('Error al obtener el perfil del usuario:', profileError);
            
            // Si hay un error al obtener el perfil pero tenemos la sesión,
            // creamos un usuario con información básica
            const basicUser = createBasicUser(
              newSession.user.id,
              newSession.user.email,
              newSession.user.user_metadata
            );
            
            setUser(basicUser);
            setAuthenticated(true);
          } else if (profileData) {
            // Cast profileData to the correct type
            const typedProfile = profileData as ProfileData;
            
            // Crear el objeto de usuario con los datos del perfil
            const fullUser = createUserFromProfile(
              newSession.user.id,
              newSession.user.email,
              typedProfile,
              newSession.user.user_metadata
            );
            
            setUser(fullUser);
            setAuthenticated(true);
          }
        } catch (error) {
          console.error('Error al procesar el perfil del usuario:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        // La sesión se ha actualizado, pero no necesitamos recargar el perfil
        setSession(newSession);
      }
    });
    
    // Limpiar la suscripción al desmontar el componente
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setAuthenticated]);
  
  // Implementación de los métodos de autenticación
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: authUser, session: authSession } = await loginService(email, password);
      
      if (authUser) {
        setUser(authUser);
        if (authSession) {
          setSession(authSession);
        }
        setAuthenticated(true);
        
        toast({
          title: "Sesión iniciada",
          description: "Has iniciado sesión correctamente",
        });
      }
    } catch (error: any) {
      let errorMessage = "Error al iniciar sesión";
      
      // Mensajes de error más amigables
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciales inválidas. Verifica tu email y contraseña.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email no confirmado. Revisa tu bandeja de entrada.";
      } else if (error.message.includes("connection")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else if (error.message.includes("demo")) {
        errorMessage = "En modo demo, usa email: demo@multilimpsac.com y contraseña: demo123";
      }
      
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await registerService(email, password, name);
      
      toast({
        title: "Registro exitoso",
        description: "Te has registrado correctamente. Verifica tu correo para confirmar tu cuenta.",
      });
    } catch (error: any) {
      let errorMessage = "Error al registrar usuario";
      
      // Mensajes de error más amigables
      if (error.message.includes("already registered")) {
        errorMessage = "Este correo ya está registrado.";
      } else if (error.message.includes("password")) {
        errorMessage = "La contraseña no cumple con los requisitos de seguridad.";
      } else if (error.message.includes("connection")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else if (error.message.includes("demo")) {
        errorMessage = "El registro está desactivado en modo demo.";
      }
      
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const createUser = async (email: string, password: string, name: string, role: string) => {
    setLoading(true);
    try {
      await createUserService(email, password, name, role, user);
      
      toast({
        title: "Usuario creado",
        description: `El usuario ${name} ha sido creado correctamente. Se ha enviado un correo de confirmación.`,
      });
    } catch (error: any) {
      let errorMessage = "Ha ocurrido un error al crear el usuario";
      
      // Mensajes de error más amigables
      if (error.message.includes("already registered")) {
        errorMessage = "Este correo ya está registrado.";
      } else if (error.message.includes("permission")) {
        errorMessage = "No tienes permisos para realizar esta acción.";
      } else if (error.message.includes("connection")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else if (error.message.includes("demo")) {
        errorMessage = "La creación de usuarios está desactivada en modo demo.";
      }
      
      toast({
        variant: "destructive",
        title: "Error al crear usuario",
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      
      setUser(null);
      setSession(null);
      setAuthenticated(false);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión: " + error.message,
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const refreshSession = async () => {
    if (DEMO_MODE) {
      console.log('Modo demo activado, no es necesario actualizar la sesión');
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, session: newSession } = await refreshSessionService();
      
      if (success && newSession) {
        setSession(newSession);
        toast({
          title: "Sesión actualizada",
          description: "Tu sesión ha sido actualizada correctamente",
        });
      }
    } catch (error: any) {
      console.error('Error al actualizar la sesión:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la sesión: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: useAuthStore(state => state.isAuthenticated),
    connectionStatus,
    login,
    logout,
    register,
    createUser,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
