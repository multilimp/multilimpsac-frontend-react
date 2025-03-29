
export interface Supplier {
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
export interface SupplierDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  monto?: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}
