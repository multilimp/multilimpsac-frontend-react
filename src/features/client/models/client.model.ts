/**
 * Cliente domain model
 * Core entity model for cliente domain
 */

import { EntityBase, Address, mapEntityStatus, mapStatusToBoolean, formatDateString, mapId } from '@/features/shared/models';

// Core cliente domain entity
export interface Cliente {
  id: string;
  razonSocial: string;
  ruc: string;
  codUnidad: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  direccion?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
  contactos?: ContactoCliente[];
}

// Contacto cliente entity
export interface ContactoCliente {
  id: string;
  clienteId: string;
  nombre: string;
  telefono?: string;
  correo?: string;
  cargo?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Repository interfaces
export interface ClienteRepository {
  findAll: () => Promise<Cliente[]>;
  findById: (id: string) => Promise<Cliente>;
  create: (cliente: Partial<Cliente>) => Promise<Cliente>;
  update: (id: string, cliente: Partial<Cliente>) => Promise<Cliente>;
  delete: (id: string) => Promise<void>;
  findContactos: (clienteId: string) => Promise<ContactoCliente[]>;
  createContacto: (contacto: Partial<ContactoCliente>) => Promise<ContactoCliente>;
  updateContacto: (id: string, contacto: Partial<ContactoCliente>) => Promise<ContactoCliente>;
  deleteContacto: (id: string) => Promise<void>;
}

// Database schema mapping for Supabase
export interface ClienteDB {
  id: number;
  ruc: string;
  razon_social: string;
  cod_unidad: string;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  direccion: string | null;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactoClienteDB {
  id: number;
  nombre: string;
  telefono: string | null;
  correo: string | null;
  cargo: string | null;
  cliente_id: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

// Domain mappers
export const mapClienteFromDB = (db: ClienteDB): Cliente => ({
  id: db.id.toString(),
  razonSocial: db.razon_social,
  ruc: db.ruc,
  codUnidad: db.cod_unidad,
  departamento: db.departamento || undefined,
  provincia: db.provincia || undefined,
  distrito: db.distrito || undefined,
  direccion: db.direccion || undefined,
  estado: db.estado,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const mapClienteToDB = (domain: Partial<Cliente>): Partial<ClienteDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.razonSocial ? { razon_social: domain.razonSocial } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.codUnidad ? { cod_unidad: domain.codUnidad } : {}),
  ...(domain.departamento ? { departamento: domain.departamento } : {}),
  ...(domain.provincia ? { provincia: domain.provincia } : {}),
  ...(domain.distrito ? { distrito: domain.distrito } : {}),
  ...(domain.direccion ? { direccion: domain.direccion } : {}),
  ...(domain.estado !== undefined ? { estado: domain.estado } : {}),
});

export const mapContactoClienteFromDB = (db: ContactoClienteDB): ContactoCliente => ({
  id: db.id.toString(),
  clienteId: db.cliente_id.toString(),
  nombre: db.nombre,
  telefono: db.telefono || undefined,
  correo: db.correo || undefined,
  cargo: db.cargo || undefined,
  estado: db.estado,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const mapContactoClienteToDB = (domain: Partial<ContactoCliente>): Partial<ContactoClienteDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.clienteId ? { cliente_id: parseInt(domain.clienteId) } : {}),
  ...(domain.nombre ? { nombre: domain.nombre } : {}),
  ...(domain.telefono ? { telefono: domain.telefono } : {}),
  ...(domain.correo ? { correo: domain.correo } : {}),
  ...(domain.cargo ? { cargo: domain.cargo } : {}),
  ...(domain.estado !== undefined ? { estado: domain.estado } : {}),
});
