
/**
 * Transport data model
 */

// Database schema mapping for Supabase
export interface TransportDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  cobertura?: string;
  estado: boolean;
  created_at: string;
  updated_at: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

// Application model
export interface Transport {
  id: string;
  name: string;
  ruc: string;
  address: string;
  coverage: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
  department?: string;
  province?: string;
  district?: string;
  createdAt: string;
  updatedAt: string;
}
