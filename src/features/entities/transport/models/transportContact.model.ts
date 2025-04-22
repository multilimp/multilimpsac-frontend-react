
import { Contact } from '@/features/shared/models';

/**
 * Transport Contact domain model
 * Core entity model for transport contact domain
 */

// Core transport contact domain entity
export interface TransportContact extends Contact {
  id: string;
  transportId: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// Database schema mapping for Supabase
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
export const mapTransportContactFromDB = (db: TransportContactDB): TransportContact => ({
  id: db.id.toString(),
  transportId: db.transporte_id?.toString() || '',
  name: db.nombre || '',
  position: db.cargo,
  phone: db.telefono || '',
  email: db.correo || '',
  status: db.estado ? 'active' : 'inactive',
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapTransportContactToDB = (domain: Partial<TransportContact>): Partial<TransportContactDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.transportId ? { transporte_id: parseInt(domain.transportId) } : {}),
  ...(domain.name !== undefined ? { nombre: domain.name } : {}),
  ...(domain.position !== undefined ? { cargo: domain.position } : {}),
  ...(domain.phone !== undefined ? { telefono: domain.phone } : {}),
  ...(domain.email !== undefined ? { correo: domain.email } : {}),
  ...(domain.status !== undefined ? { estado: domain.status === 'active' } : {})
});
