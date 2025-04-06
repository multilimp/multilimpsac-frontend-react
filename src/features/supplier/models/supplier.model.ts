
/**
 * Supplier domain model
 * Core entity model for supplier domain
 */

// Core supplier domain entity
export interface Supplier {
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
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Value objects and specialized subtypes
export interface SupplierContact {
  id: string;
  supplierId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface SupplierBankAccount {
  id: string;
  supplierId: string;
  bank: string;
  accountNumber: string;
  accountType: "savings" | "checking" | "other";
  isDefault: boolean;
}

// Domain events
export type SupplierCreatedEvent = { supplier: Supplier };
export type SupplierUpdatedEvent = { supplier: Supplier, changes: Partial<Supplier> };
export type SupplierDeletedEvent = { supplierId: string };

// Repository interfaces
export interface SupplierRepository {
  findAll: () => Promise<Supplier[]>;
  findById: (id: string) => Promise<Supplier | null>;
  create: (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>;
  update: (id: string, data: Partial<Supplier>) => Promise<Supplier>;
  delete: (id: string) => Promise<void>;
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

// Domain mappers
export const mapSupplierFromDB = (db: SupplierDB): Supplier => ({
  id: db.id.toString(),
  name: db.razon_social,
  ruc: db.ruc,
  address: db.direccion,
  phone: '', // Not in DB schema, would need to be fetched separately
  email: '', // Not in DB schema, would need to be fetched separately
  contact: '', // Not in DB schema, would need to be fetched separately 
  status: db.estado ? 'active' : 'inactive',
  department: db.departamento,
  province: db.provincia,
  district: db.distrito,
  amount: db.monto,
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapSupplierToDB = (domain: Partial<Supplier>): Partial<SupplierDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.status ? { estado: domain.status === 'active' } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.district ? { distrito: domain.district } : {}),
  ...(domain.amount ? { monto: domain.amount } : {}),
});
