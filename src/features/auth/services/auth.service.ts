
import { supabase, checkSupabaseConnection, checkTableAccess } from '@/integrations/supabase/client';
import { DEMO_MODE, DEMO_USER, User, ProfileData } from '../types/auth.types';
import { createUserFromProfile, createBasicUser } from '../utils/auth.utils';

/**
 * Login with email and password
 */
export const loginService = async (email: string, password: string, isDemoMode: boolean = DEMO_MODE) => {
  if (isDemoMode) {
    // En modo demo, verificamos credenciales demo
    if (email === 'demo@multilimpsac.com' && password === 'demo123') {
      return { user: DEMO_USER, session: null };
    } else {
      throw new Error("Credenciales demo incorrectas");
    }
  }
  
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
  
  if (!data.session) {
    throw new Error("No se pudo iniciar sesión. No se obtuvo una sesión válida.");
  }
  
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
    const basicUser = createBasicUser(
      data.user.id,
      data.user.email,
      data.user.user_metadata
    );
    
    return { user: basicUser, session: data.session };
  }
  
  // Crear el objeto de usuario con los datos del perfil
  const fullUser = createUserFromProfile(
    data.user.id,
    data.user.email,
    profileData as ProfileData,
    data.user.user_metadata
  );
  
  return { user: fullUser, session: data.session };
};

/**
 * Register a new user
 */
export const registerService = async (email: string, password: string, name: string, isDemoMode: boolean = DEMO_MODE) => {
  if (isDemoMode) {
    throw new Error("Registro desactivado en modo demo");
  }
  
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
  
  if (!data.user) {
    throw new Error("No se pudo registrar al usuario");
  }
  
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
  
  return data;
};

/**
 * Create a new user (admin only)
 */
export const createUserService = async (
  email: string, 
  password: string, 
  name: string, 
  role: string,
  currentUser: User | null,
  isDemoMode: boolean = DEMO_MODE
) => {
  if (isDemoMode) {
    throw new Error("Creación de usuarios desactivada en modo demo");
  }
  
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error("Solo los administradores pueden crear nuevos usuarios");
  }

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
  
  if (!authData.user) {
    throw new Error("No se pudo crear el usuario");
  }
  
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
  
  return authData;
};

/**
 * Logout the current user
 */
export const logoutService = async (isDemoMode: boolean = DEMO_MODE) => {
  if (isDemoMode) {
    return { success: true };
  }
  
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  return { success: true };
};

/**
 * Refresh the current session
 */
export const refreshSessionService = async (isDemoMode: boolean = DEMO_MODE) => {
  if (isDemoMode) {
    return { success: true, session: null };
  }
  
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error) throw error;
  
  return { success: true, session: data.session };
};
