
// Base client model interfaces aligned with database schema
export interface Client {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  email: string;
  position: string;
}

export type ClientFormInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

// Spanish interface versions for backward compatibility
export interface Cliente {
  id: string;
  razonSocial: string;
  ruc: string;
  codUnidad: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  estado: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactoCliente {
  id: string;
  clienteId: string;
  nombre: string;
  telefono?: string;
  correo?: string;
  cargo?: string;
  estado: boolean;
}

// Database interfaces
export interface ClienteDB {
  id: number;
  razon_social: string;
  ruc: string;
  cod_unidad: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  estado: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ContactoClienteDB {
  id: number;
  cliente_id: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  cargo?: string;
  estado: boolean;
  created_at: string;
  updated_at?: string;
}

// Mapping functions
export const mapClienteFromDB = (db: ClienteDB): Cliente => ({
  id: db.id.toString(),
  razonSocial: db.razon_social,
  ruc: db.ruc,
  codUnidad: db.cod_unidad,
  direccion: db.direccion,
  departamento: db.departamento,
  provincia: db.provincia,
  distrito: db.distrito,
  estado: db.estado,
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapClienteToDB = (cliente: Partial<Cliente>): Partial<ClienteDB> => ({
  razon_social: cliente.razonSocial,
  ruc: cliente.ruc,
  cod_unidad: cliente.codUnidad,
  direccion: cliente.direccion,
  departamento: cliente.departamento,
  provincia: cliente.provincia,
  distrito: cliente.distrito,
  estado: cliente.estado
});

export const mapContactoClienteFromDB = (db: ContactoClienteDB): ContactoCliente => ({
  id: db.id.toString(),
  clienteId: db.cliente_id.toString(),
  nombre: db.nombre,
  telefono: db.telefono,
  correo: db.correo,
  cargo: db.cargo,
  estado: db.estado
});

export const mapContactoClienteToDB = (contacto: Partial<ContactoCliente>): Partial<ContactoClienteDB> => ({
  cliente_id: contacto.clienteId ? parseInt(contacto.clienteId) : undefined,
  nombre: contacto.nombre,
  telefono: contacto.telefono,
  correo: contacto.correo,
  cargo: contacto.cargo,
  estado: contacto.estado
});
