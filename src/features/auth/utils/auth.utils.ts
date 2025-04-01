
import { supabase } from '@/integrations/supabase/client';
import { User, ProfileData } from '../types/auth.types';

/**
 * Creates a user object from session and profile data
 */
export const createUserFromProfile = (userId: string, email: string | undefined, profileData: ProfileData, userMetadata?: any): User => {
  return {
    id: userId,
    name: profileData.name || userMetadata?.name || 'Usuario',
    email: email || '',
    role: profileData.role || userMetadata?.role || 'user',
    permissions: profileData.permissions || [],
    avatar: profileData.avatar
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
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data as ProfileData;
};
