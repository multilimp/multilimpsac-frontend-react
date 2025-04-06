
/**
 * Company data model
 */

// Database schema mapping for Supabase
export interface CompanyDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

// Application model
export interface Company {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}
