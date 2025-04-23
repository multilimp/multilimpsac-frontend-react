
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactoCliente {
  id: string;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  email?: string; // For compatibility with some components
  estado: boolean;
  clientId?: string;
}

// Database schema mappings
export interface ClientDB {
  id: number;
  razon_social: string;
  ruc: string;
  cod_unidad: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactoClienteDB {
  id: number;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  cliente_id?: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mapping functions
export const mapClientFromDB = (db: ClientDB): Cliente => ({
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

export const mapClientToDB = (client: Partial<Cliente>): Partial<ClientDB> => ({
  ...(client.id ? { id: parseInt(client.id) } : {}),
  ...(client.razonSocial !== undefined ? { razon_social: client.razonSocial } : {}),
  ...(client.ruc !== undefined ? { ruc: client.ruc } : {}),
  ...(client.codUnidad !== undefined ? { cod_unidad: client.codUnidad } : {}),
  ...(client.direccion !== undefined ? { direccion: client.direccion } : {}),
  ...(client.departamento !== undefined ? { departamento: client.departamento } : {}),
  ...(client.provincia !== undefined ? { provincia: client.provincia } : {}),
  ...(client.distrito !== undefined ? { distrito: client.distrito } : {}),
  ...(client.estado !== undefined ? { estado: client.estado } : {})
});

export const mapContactFromDB = (db: ContactoClienteDB): ContactoCliente => ({
  id: db.id.toString(),
  nombre: db.nombre,
  cargo: db.cargo,
  telefono: db.telefono,
  correo: db.correo,
  email: db.correo, // Map correo to email for compatibility
  estado: db.estado,
  clientId: db.cliente_id?.toString()
});

export const mapContactToDB = (contact: Partial<ContactoCliente>): Partial<ContactoClienteDB> => ({
  ...(contact.id ? { id: parseInt(contact.id) } : {}),
  ...(contact.nombre !== undefined ? { nombre: contact.nombre } : {}),
  ...(contact.cargo !== undefined ? { cargo: contact.cargo } : {}),
  ...(contact.telefono !== undefined ? { telefono: contact.telefono } : {}),
  ...(contact.correo !== undefined ? { correo: contact.correo } : {}),
  ...(contact.email !== undefined && !contact.correo ? { correo: contact.email } : {}),
  ...(contact.clientId ? { cliente_id: parseInt(contact.clientId) } : {}),
  ...(contact.estado !== undefined ? { estado: contact.estado } : {})
});

// Helper function for client contact normalization
export const normalizeClientContact = (contact: Partial<ContactoCliente>): Partial<ContactoCliente> => ({
  ...contact,
  correo: contact.email || contact.correo,
  email: contact.correo || contact.email
});

// Alias types for compatibility
export type Client = Cliente;
export type ClientContact = ContactoCliente;
