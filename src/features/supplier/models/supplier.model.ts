
/**
 * Supplier domain model
 * Core entity model for supplier domain
 */

import { EntityBase, Address, mapEntityStatus, mapStatusToBoolean, formatDateString, mapId } from '@/features/shared/models';

// Core supplier domain entity
export interface Supplier extends EntityBase, Address {
  name: string;
  ruc: string;
  phone: string;
  email: string;
  contact: string;
  amount?: number;
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
  id: mapId(db.id),
  name: db.razon_social,
  ruc: db.ruc,
  address: db.direccion || '',
  phone: '', // No disponible en la BD
  email: '', // No disponible en la BD
  contact: '', // No disponible en la BD
  status: mapEntityStatus(db.estado),
  department: db.departamento,
  province: db.provincia,
  district: db.distrito,
  amount: db.monto,
  createdAt: formatDateString(db.created_at),
  updatedAt: formatDateString(db.updated_at)
});

export const mapSupplierToDB = (domain: Partial<Supplier>): Partial<SupplierDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.status !== undefined ? { estado: mapStatusToBoolean(domain.status) } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.district ? { distrito: domain.district } : {}),
  ...(domain.amount ? { monto: domain.amount } : {}),
});
