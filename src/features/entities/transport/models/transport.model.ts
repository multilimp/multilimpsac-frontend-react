
import { EntityBase, Address, mapBooleanToStatus } from '@/features/shared/models';

/**
 * Transport domain model
 * Core entity model for transport domain
 */

// Core transport domain entity
export interface Transport extends Omit<EntityBase, 'status'>, Address {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  cobertura: string;
  estado: boolean;
  departamento: string;
  provincia: string;
  distrito: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Aliases for compatibility with generic components
  name?: string;
  address?: string;
  coverage?: string;
  status: 'active' | 'inactive'; // Changed to required to match EntityBase
  department?: string;
  province?: string;
  district?: string;
}

// Database schema mapping for Supabase
export interface TransportDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  cobertura: string;
  estado: boolean;
  departamento: string;
  provincia: string;
  distrito: string;
  created_at?: string;
  updated_at?: string;
}

// Domain mappers
export const mapTransportFromDB = (db: TransportDB): Transport => ({
  id: db.id.toString(),
  razon_social: db.razon_social,
  ruc: db.ruc,
  direccion: db.direccion,
  cobertura: db.cobertura,
  estado: db.estado,
  departamento: db.departamento,
  provincia: db.provincia,
  distrito: db.distrito,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
  
  // Add aliases for compatibility
  name: db.razon_social,
  address: db.direccion,
  coverage: db.cobertura,
  status: db.estado ? 'active' : 'inactive',
  department: db.departamento,
  province: db.provincia,
  district: db.distrito
});

export const mapTransportToDB = (transport: Partial<Transport>): Partial<TransportDB> => ({
  ...(transport.id ? { id: parseInt(transport.id) } : {}),
  ...(transport.razon_social !== undefined ? { razon_social: transport.razon_social } : {}),
  ...(transport.name !== undefined && !transport.razon_social ? { razon_social: transport.name } : {}),
  ...(transport.ruc !== undefined ? { ruc: transport.ruc } : {}),
  ...(transport.direccion !== undefined ? { direccion: transport.direccion } : {}),
  ...(transport.address !== undefined && !transport.direccion ? { direccion: transport.address } : {}),
  ...(transport.cobertura !== undefined ? { cobertura: transport.cobertura } : {}),
  ...(transport.coverage !== undefined && !transport.cobertura ? { cobertura: transport.coverage } : {}),
  ...(transport.estado !== undefined ? { estado: transport.estado } : {}),
  ...(transport.status !== undefined && transport.estado === undefined ? { estado: transport.status === 'active' } : {}),
  ...(transport.departamento !== undefined ? { departamento: transport.departamento } : {}),
  ...(transport.department !== undefined && !transport.departamento ? { departamento: transport.department } : {}),
  ...(transport.provincia !== undefined ? { provincia: transport.provincia } : {}),
  ...(transport.province !== undefined && !transport.provincia ? { provincia: transport.province } : {}),
  ...(transport.distrito !== undefined ? { distrito: transport.distrito } : {}),
  ...(transport.district !== undefined && !transport.distrito ? { distrito: transport.district } : {})
});
