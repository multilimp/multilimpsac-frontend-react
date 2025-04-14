
import { supabase } from '@/integrations/supabase/client';
import { User, ProfileData } from '../models/auth.types';

/**
 * Creates a user object from session and profile data
 */
export const createUserFromProfile = (userId: string, email: string | undefined, profileData: ProfileData, userMetadata?: any): User => {
  // Map role from 'rol' to admin/user only to match the type definition
  const role = mapRoleToAllowedType(profileData.rol || userMetadata?.role || 'user');

  return {
    id: userId,
    name: profileData.name || profileData.nombre || userMetadata?.name || 'Usuario',
    email: email || profileData.email || '',
    role, // Using mapped role
    permissions: profileData.tabla ? [profileData.tabla] : [], // Using tabla as permissions for now
    avatar: profileData.foto
  };
};

/**
 * Creates a basic user object from session data
 */
export const createBasicUser = (userId: string, email: string | undefined, userMetadata?: any): User => {
  // Map role from metadata to admin/user only to match the type definition
  const role = mapRoleToAllowedType(userMetadata?.role || 'user');
  
  return {
    id: userId,
    name: userMetadata?.name || 'Usuario',
    email: email || '',
    role, // Using mapped role
    permissions: []
  };
};

/**
 * Maps any role value to allowed "admin" | "user" types
 */
export const mapRoleToAllowedType = (role: string): "admin" | "user" => {
  return role === 'admin' ? 'admin' : 'user';
};

/**
 * Fetches user profile from database
 */
export const fetchUserProfile = async (userId: string) => {
  // Convert userId to number if needed, or use a direct equality check
  const { data: userData, error } = await supabase
    .from('users')  // Using the correct table name 'users' instead of 'usuarios'
    .select('*')
    .eq('id', parseInt(userId, 10))
    .single();
    
  if (error) {
    throw error;
  }
  
  return userData as ProfileData;
};
