
/**
 * Supplier data model
 */

// Database schema mapping for Supabase
export interface SupplierDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

// Application model
export interface Supplier {
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
