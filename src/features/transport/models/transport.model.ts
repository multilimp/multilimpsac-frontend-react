
/**
 * Transport domain model
 * Core entity model for transport domain
 */

// Core transport domain entity
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
  createdAt?: string;
  updatedAt?: string;
}

// Value objects and specialized subtypes
export interface TransportContact {
  id: string;
  transportId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

// Database schema mapping for Supabase
export interface TransportDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  cobertura?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

// For compatibility with existing components
export interface Transporte {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  cobertura?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

// For compatibility with existing components
export interface ContactoTransporte {
  id: string;
  transporte_id: string;
  nombre: string;
  cargo: string;
  correo?: string;
  telefono: string;
  estado?: boolean;
}

// Domain mappers
export const mapTransportFromDB = (db: TransportDB): Transport => ({
  id: db.id.toString(),
  name: db.razon_social,
  ruc: db.ruc,
  address: db.direccion,
  coverage: db.cobertura || '',
  phone: '', // Not in DB schema, would need to be fetched separately
  email: '', // Not in DB schema, would need to be fetched separately
  contact: '', // Not in DB schema, would need to be fetched separately
  status: db.estado ? 'active' : 'inactive',
  department: db.departamento,
  province: db.provincia,
  district: db.distrito,
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapTransportToDB = (domain: Partial<Transport>): Partial<TransportDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.coverage ? { cobertura: domain.coverage } : {}),
  ...(domain.status !== undefined ? { estado: domain.status === 'active' } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.district ? { distrito: domain.district } : {})
});

// Utility function to convert TransportDB to Transporte for UI components
export const convertToTransporte = (transport: Transport): Transporte => ({
  id: transport.id,
  razon_social: transport.name,
  ruc: transport.ruc,
  direccion: transport.address,
  cobertura: transport.coverage,
  estado: transport.status === 'active',
  departamento: transport.department,
  provincia: transport.province,
  distrito: transport.district,
  created_at: transport.createdAt,
  updated_at: transport.updatedAt
});
