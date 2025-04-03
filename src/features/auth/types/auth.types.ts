
import { Session } from '@supabase/supabase-js';

// DEMO Mode configuration
export const DEMO_MODE = true;

// Interface for user data
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  permissions: string[];
  roles?: string[]; 
}

// Demo user for testing
export const DEMO_USER: User = {
  id: 'demo-user-id',
  name: 'Usuario Demo',
  email: 'demo@multilimpsac.com',
  role: 'admin',
  permissions: ['*'],
  roles: ['admin']
};

// Interface for profile data from the database (usuarios table)
export interface ProfileData {
  id: number;
  name: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "admin" | "user";
  foto?: string;
  created_at: string;
  updated_at: string;
  tabla?: string;
  email_verified_at?: string;
  password?: string;
  remember_token?: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Added this property
  isAuthenticated: boolean;
  connectionStatus: ConnectionStatus;
  isDemoMode: boolean; // Added this property
  enableDemoMode: () => void; // Added this method
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createUser: (email: string, password: string, name: string, role: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}
