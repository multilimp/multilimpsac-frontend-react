
/**
 * Client domain model
 * Core entity model for client domain
 */

// Core client domain entity
export interface Client {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
  department?: string;
  province?: string;
  district?: string;
  unitCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Value objects and specialized subtypes
export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: "contract" | "license" | "certificate" | "other";
  filePath: string;
  uploadedAt: string;
  expiryDate?: string;
}

// Domain events
export type ClientCreatedEvent = { client: Client };
export type ClientUpdatedEvent = { client: Client, changes: Partial<Client> };
export type ClientDeletedEvent = { clientId: string };

// Repository interfaces
export interface ClientRepository {
  findAll: () => Promise<Client[]>;
  findById: (id: string) => Promise<Client | null>;
  create: (client: Omit<Client, 'id'>) => Promise<Client>;
  update: (id: string, data: Partial<Client>) => Promise<Client>;
  delete: (id: string) => Promise<void>;
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

// Domain mappers
export const mapClientFromDB = (db: ClientDB): Client => ({
  id: db.id.toString(),
  name: db.razon_social,
  ruc: db.ruc,
  address: db.direccion,
  phone: db.telefono || '',
  email: db.correo || '',
  contact: '', // Not in DB schema, would need to be fetched separately
  status: db.estado ? 'active' : 'inactive',
  department: db.departamento,
  province: db.provincia,
  district: db.distrito,
  unitCode: db.cod_unidad,
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapClientToDB = (domain: Partial<Client>): Partial<ClientDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.phone ? { telefono: domain.phone } : {}),
  ...(domain.email ? { correo: domain.email } : {}),
  ...(domain.status ? { estado: domain.status === 'active' } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.district ? { distrito: domain.district } : {}),
  ...(domain.unitCode ? { cod_unidad: domain.unitCode } : {})
});
