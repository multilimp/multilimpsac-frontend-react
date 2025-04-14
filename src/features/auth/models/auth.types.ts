
export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

export interface ProfileData {
  id: number;
  nombre?: string;
  apellido?: string;
  name?: string;
  email?: string;
  rol: string;
  tabla?: string;
  foto?: string;
  password?: string;
  username?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user"; // This strictly matches the authStore User type
  permissions: string[];
  avatar?: string;
  roles?: string[];
}

// Demo mode setting
export const DEMO_MODE = true;

// Demo user for development
export const DEMO_USER: User = {
  id: 'demo-user-123',
  name: 'Usuario Demo',
  email: 'demo@multilimpsac.com',
  role: 'admin',
  permissions: ['*'],
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
};

export interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  connectionStatus: ConnectionStatus;
  isDemoMode: boolean;
  enableDemoMode: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createUser: (email: string, password: string, name: string, role: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Definición de los campos en la tabla users de Supabase
export interface UserTableFields {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  password: string;
  rol: string;
  tabla?: string;
  foto?: string;
  username: string;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string;
  remember_token?: string;
}
