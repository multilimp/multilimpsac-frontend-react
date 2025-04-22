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
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  estado: boolean;
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

export interface TransportContactDB {
  id: number;
  transporte_id: number;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
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
  ...(domain.status ? { estado: domain.status === 'active' } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.district ? { distrito: domain.district } : {})
});

// Transport Contact mappers
export const mapTransportContactFromDB = (db: TransportContactDB): TransportContact => ({
  id: db.id.toString(),
  transportId: db.transporte_id.toString(),
  nombre: db.nombre,
  cargo: db.cargo,
  telefono: db.telefono,
  correo: db.correo,
  estado: db.estado
});

export const mapTransportContactToDB = (domain: Partial<TransportContact>): Partial<TransportContactDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.transportId ? { transporte_id: parseInt(domain.transportId) } : {}),
  ...(domain.nombre !== undefined ? { nombre: domain.nombre } : {}),
  ...(domain.cargo !== undefined ? { cargo: domain.cargo } : {}),
  ...(domain.telefono !== undefined ? { telefono: domain.telefono } : {}),
  ...(domain.correo !== undefined ? { correo: domain.correo } : {}),
  ...(domain.estado !== undefined ? { estado: domain.estado } : {})
});
