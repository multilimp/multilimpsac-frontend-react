
import { Contact } from '@/features/shared/models';

/**
 * Supplier Contact domain model
 * Core entity model for supplier contact domain
 */

// Core supplier contact domain entity
export interface SupplierContact extends Contact {
  id: string;
  supplierId: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// Database schema mapping for Supabase
export interface SupplierContactDB {
  id: number;
  proveedor_id: number;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

// Domain mappers
export const mapSupplierContactFromDB = (db: SupplierContactDB): SupplierContact => ({
  id: db.id.toString(),
  supplierId: db.proveedor_id?.toString() || '',
  name: db.nombre || '',
  position: db.cargo,
  phone: db.telefono || '',
  email: db.correo || '',
  status: db.estado ? 'active' : 'inactive',
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapSupplierContactToDB = (domain: Partial<SupplierContact>): Partial<SupplierContactDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.supplierId ? { proveedor_id: parseInt(domain.supplierId) } : {}),
  ...(domain.name !== undefined ? { nombre: domain.name } : {}),
  ...(domain.position !== undefined ? { cargo: domain.position } : {}),
  ...(domain.phone !== undefined ? { telefono: domain.phone } : {}),
  ...(domain.email !== undefined ? { correo: domain.email } : {}),
  ...(domain.status !== undefined ? { estado: domain.status === 'active' } : {})
});
