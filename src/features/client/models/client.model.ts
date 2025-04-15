/**
 * Client domain model
 * Core entity model for client domain
 */

import { EntityBase, Address, mapEntityStatus, mapStatusToBoolean, formatDateString, mapId } from '@/features/shared/models';

// Core client domain entity
export interface Client extends EntityBase, Address {
  name: string;
  ruc: string;
  unitCode: string;
  email?: string;  // Add optional email
  contactPerson?: string;  // Add optional contactPerson
  active?: boolean;  // Add optional active status
  createdAt?: string;  // Add optional createdAt
}

// Database schema mapping for Supabase
export interface ClientDB {
  id: number;
  cod_unidad: string;
  razon_social: string;
  ruc: string;
  estado: boolean;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  created_at?: string;
  updated_at?: string;
}

// DTO types for client service
export interface ClientCreateDTO {
  cod_unidad?: string;
  razon_social?: string;
  ruc?: string;
  estado?: boolean;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

export interface ClientUpdateDTO {
  cod_unidad?: string;
  razon_social?: string;
  ruc?: string;
  estado?: boolean;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

// Domain mappers
export const mapClientFromDB = (db: ClientDB): Client => ({
  id: mapId(db.id),
  name: db.razon_social,
  ruc: db.ruc,
  unitCode: db.cod_unidad,
  address: db.direccion || '',
  district: db.distrito,
  province: db.provincia,
  department: db.departamento,
  status: mapEntityStatus(db.estado),
  createdAt: formatDateString(db.created_at),
  updatedAt: formatDateString(db.updated_at)
});

export const mapClientToDB = (domain: Partial<Client>): Partial<ClientDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.unitCode ? { cod_unidad: domain.unitCode } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.district ? { distrito: domain.district } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.status !== undefined ? { estado: mapStatusToBoolean(domain.status) } : {})
});
