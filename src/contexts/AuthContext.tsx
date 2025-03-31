import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { supabase, checkSupabaseConnection, checkTableAccess } from '@/integrations/supabase/client';
import { useAuthStore, User } from '@/store/authStore';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Constante para habilitar/deshabilitar el modo demo
const DEMO_MODE = true;

// Usuario demo predefinido
const DEMO_USER: User = {
  id: 'demo-user-id',
  name: 'Usuario Demo',
  email: 'demo@multilimpsac.com',
  role: 'admin',
  permissions: ['*'],
  roles: ['admin']
};

type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  connectionStatus: ConnectionStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createUser: (email: string, password: string, name: string, role: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const { user, setUser } = useAuthStore();
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
              const basicUser: User = {
                id: currentSession.user.id,
                name: currentSession.user.user_metadata?.name || 'Usuario',
                email: currentSession.user.email || '',
                role: currentSession.user.user_metadata?.role || 'user',
                permissions: []
              };
              
              setUser(basicUser);
              setAuthenticated(true);
              
              toast({
                variant: "default",
                title: "Advertencia",
                description: "Se cargó una sesión parcial. Algunas funciones pueden estar limitadas.",
              });
            } else if (profileData) {
              // Crear el objeto de usuario con los datos del perfil
              const fullUser: User = {
                id: currentSession.user.id,
                name: profileData.name || currentSession.user.user_metadata?.name || 'Usuario',
                email: currentSession.user.email || '',
                role: profileData.role || currentSession.user.user_metadata?.role || 'user',
                permissions: profileData.permissions || [],
                avatar: profileData.avatar_url
              };
              
              setUser(fullUser);
              setAuthenticated(true);
            }
          } catch (error) {
            console.error('Error al procesar el perfil del usuario:', error);
            
            // Crear usuario básico en caso de error
            const basicUser: User = {
              id: currentSession.user.id,
              name: currentSession.user.user_metadata?.name || 'Usuario',
              email: currentSession.user.email || '',
              role: currentSession.user.user_metadata?.role || 'user',
              permissions: []
            };
            
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
  }, [toast, setUser]);

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
            const basicUser: User = {
              id: newSession.user.id,
              name: newSession.user.user_metadata?.name || 'Usuario',
              email: newSession.user.email || '',
              role: newSession.user.user_metadata?.role || 'user',
              permissions: []
            };
            
            setUser(basicUser);
            setAuthenticated(true);
          } else if (profileData) {
            // Crear el objeto de usuario con los datos del perfil
            const fullUser: User = {
              id: newSession.user.id,
              name: profileData.name || newSession.user.user_metadata?.name || 'Usuario',
              email: newSession.user.email || '',
              role: profileData.role || newSession.user.user_metadata?.role || 'user',
              permissions: profileData.permissions || [],
              avatar: profileData.avatar_url
            };
            
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
  }, [setUser]);

  // Función para actualizar la sesión manualmente
  const refreshSession = async () => {
    if (DEMO_MODE) {
      console.log('Modo demo activado, no es necesario actualizar la sesión');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
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

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    if (DEMO_MODE) {
      // En modo demo, verificamos credenciales demo
      if (email === 'demo@multilimpsac.com' && password === 'demo123') {
        setUser(DEMO_USER);
        setAuthenticated(true);
        
        toast({
          title: "Sesión iniciada",
          description: "Has iniciado sesión como usuario demo",
        });
        
        return;
      } else {
        // Si las credenciales no son las demo, mostramos error
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "En modo demo, usa email: demo@multilimpsac.com y contraseña: demo123",
        });
        
        throw new Error("Credenciales demo incorrectas");
      }
    }
    
    setLoading(true);
    
    try {
      // Verificar la conexión antes de intentar iniciar sesión
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("No hay conexión con el servidor. Verifica tu conexión a internet.");
      }
      
      // Verificar acceso a tabla de perfiles
      const { exists: profilesTableExists, error: profilesError } = await checkTableAccess('profiles');
      if (!profilesTableExists) {
        console.error("Error accediendo a tabla profiles:", profilesError);
        throw new Error("Error accediendo a datos de usuario. Contacta al administrador.");
      }
      
      // Iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        
        // Obtener el perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Error al obtener el perfil del usuario:', profileError);
          
          // Si hay un error al obtener el perfil pero tenemos la sesión,
          // creamos un usuario con información básica
          const basicUser: User = {
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Usuario',
            email: data.user.email || '',
            role: data.user.user_metadata?.role || 'user',
            permissions: []
          };
          
          setUser(basicUser);
          setAuthenticated(true);
        } else if (profileData) {
          // Crear el objeto de usuario con los datos del perfil
          const fullUser: User = {
            id: data.user.id,
            name: profileData.name || data.user.user_metadata?.name || 'Usuario',
            email: data.user.email || '',
            role: profileData.role || data.user.user_metadata?.role || 'user',
            permissions: profileData.permissions || [],
            avatar: profileData.avatar_url
          };
          
          setUser(fullUser);
          setAuthenticated(true);
        }
        
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

  // Función para registrar un nuevo usuario
  const register = async (email: string, password: string, name: string) => {
    if (DEMO_MODE) {
      toast({
        variant: "default",
        title: "Modo demo",
        description: "El registro está desactivado en modo demo. Usa las credenciales demo para iniciar sesión.",
      });
      
      throw new Error("Registro desactivado en modo demo");
    }
    
    setLoading(true);
    
    try {
      // Verificar la conexión antes de intentar registrar
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("No hay conexión con el servidor. Verifica tu conexión a internet.");
      }
      
      // Verificar acceso a tabla de perfiles
      const { exists: profilesTableExists, error: profilesError } = await checkTableAccess('profiles');
      if (!profilesTableExists) {
        console.error("Error accediendo a tabla profiles:", profilesError);
        throw new Error("Error accediendo a datos de usuario. Contacta al administrador.");
      }
      
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
      
      if (data.user) {
        // Crear el perfil del usuario en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            role: 'user',
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Error al crear el perfil del usuario:', profileError);
          throw profileError;
        }
        
        toast({
          title: "Registro exitoso",
          description: "Te has registrado correctamente. Verifica tu correo para confirmar tu cuenta.",
        });
      }
    } catch (error: any) {
      let errorMessage = "Error al registrar usuario";
      
      // Mensajes de error más amigables
      if (error.message.includes("already registered")) {
        errorMessage = "Este correo ya está registrado.";
      } else if (error.message.includes("password")) {
        errorMessage = "La contraseña no cumple con los requisitos de seguridad.";
      } else if (error.message.includes("connection")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
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

  // Función para que los administradores creen usuarios
  const createUser = async (email: string, password: string, name: string, role: string) => {
    if (DEMO_MODE) {
      toast({
        variant: "default",
        title: "Modo demo",
        description: "La creación de usuarios está desactivada en modo demo.",
      });
      
      throw new Error("Creación de usuarios desactivada en modo demo");
    }
    
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
      // Verificar la conexión antes de intentar crear un usuario
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("No hay conexión con el servidor. Verifica tu conexión a internet.");
      }
      
      // Verificar acceso a tabla de perfiles
      const { exists: profilesTableExists, error: profilesError } = await checkTableAccess('profiles');
      if (!profilesTableExists) {
        console.error("Error accediendo a tabla profiles:", profilesError);
        throw new Error("Error accediendo a datos de usuario. Contacta al administrador.");
      }
      
      // Crear el usuario en Supabase Auth usando la API pública
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Crear el perfil en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name,
            role,
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Error al crear el perfil del usuario:', profileError);
          throw profileError;
        }
        
        toast({
          title: "Usuario creado",
          description: `El usuario ${name} ha sido creado correctamente. Se ha enviado un correo de confirmación.`,
        });
      }
    } catch (error: any) {
      let errorMessage = "Ha ocurrido un error al crear el usuario";
      
      // Mensajes de error más amigables
      if (error.message.includes("already registered")) {
        errorMessage = "Este correo ya está registrado.";
      } else if (error.message.includes("permission")) {
        errorMessage = "No tienes permisos para realizar esta acción.";
      } else if (error.message.includes("connection")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
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

  // Función para cerrar sesión
  const logout = async () => {
    if (DEMO_MODE) {
      // En modo demo, simplemente limpiamos el estado
      setUser(null);
      setAuthenticated(false);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión del modo demo",
      });
      
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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

  const value = {
    user,
    session,
    loading,
    isAuthenticated,
    connectionStatus,
    login,
    logout,
    register,
    createUser,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};
