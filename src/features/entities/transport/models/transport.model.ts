
import { EntityBase, Address, mapEntityStatus, mapStatusToBoolean, formatDateString, mapId } from '@/features/shared/models';

// Core transport domain entity
export interface Transport extends EntityBase, Address {
  id: string;
  name: string;
  ruc: string;
  coverage: string;
  phone: string;
  email: string;
  contact: string;
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

// Domain mappers
export const mapTransportFromDB = (db: TransportDB): Transport => ({
  id: db.id.toString(),
  name: db.razon_social,
  ruc: db.ruc,
  address: db.direccion,
  coverage: db.cobertura || '',
  phone: '', // Not in DB schema yet
  email: '', // Not in DB schema yet
  contact: '', // Not in DB schema yet
  status: mapEntityStatus(db.estado),
  department: db.departamento,
  province: db.provincia,
  district: db.distrito,
  createdAt: formatDateString(db.created_at),
  updatedAt: formatDateString(db.updated_at)
});

export const mapTransportToDB = (domain: Partial<Transport>): Partial<TransportDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.coverage ? { cobertura: domain.coverage } : {}),
  ...(domain.status !== undefined ? { estado: mapStatusToBoolean(domain.status) } : {}),
  ...(domain.department ? { departamento: domain.department } : {}),
  ...(domain.province ? { provincia: domain.province } : {}),
  ...(domain.district ? { distrito: domain.district } : {})
});
