
export interface Client {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// Database schema mapping for Supabase
export interface ClientDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  cod_unidad?: string;
}
