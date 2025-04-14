
import { supabase } from '@/integrations/supabase/client';
import { User, ProfileData } from '../models/auth.types';

/**
 * Creates a user object from session and profile data
 */
export const createUserFromProfile = (userId: string, email: string | undefined, profileData: ProfileData, userMetadata?: any): User => {
  return {
    id: userId,
    name: profileData.name || profileData.nombre || userMetadata?.name || 'Usuario',
    email: email || profileData.email || '',
    role: profileData.rol || userMetadata?.role || 'user',
    permissions: profileData.tabla ? [profileData.tabla] : [], // Using tabla as permissions for now
    avatar: profileData.foto
  };
};

/**
 * Creates a basic user object from session data
 */
export const createBasicUser = (userId: string, email: string | undefined, userMetadata?: any): User => {
  return {
    id: userId,
    name: userMetadata?.name || 'Usuario',
    email: email || '',
    role: userMetadata?.role || 'user',
    permissions: []
  };
};

/**
 * Fetches user profile from database
 */
export const fetchUserProfile = async (userId: string) => {
  // Convert userId to number if needed, or use a direct equality check
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', parseInt(userId, 10))
    .single();
    
  if (error) {
    throw error;
  }
  
  return userData as ProfileData;
};
