
// Base client model interfaces aligned with database schema
export interface Client {
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

// Alias for Client to support Spanish naming in the codebase
export type Cliente = Client;

export interface ClientContact {
  id: string;
  clientId: string; // Consistent English naming
  nombre: string;
  telefono?: string;
  correo?: string;
  cargo?: string;
  estado: boolean;
}

// Alias for ClientContact to support Spanish naming in the codebase
export type ContactoCliente = ClientContact;

// Important: adding this alias with Spanish property naming to help with transition
export interface ClientContactSpanish extends Omit<ClientContact, 'clientId'> {
  clienteId: string; // Spanish naming for backward compatibility
}

export type ClientFormInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

// Database interfaces
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
  created_at: string;
  updated_at?: string;
}

// Alias for ClientDB to support Spanish naming in the codebase
export type ClienteDB = ClientDB;

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
export const mapClientFromDB = (db: ClientDB): Client => ({
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

// Alias for mapClientFromDB
export const mapClienteFromDB = mapClientFromDB;

export const mapClientToDB = (client: Partial<Client>): Partial<ClientDB> => ({
  razon_social: client.razonSocial,
  ruc: client.ruc,
  cod_unidad: client.codUnidad,
  direccion: client.direccion,
  departamento: client.departamento,
  provincia: client.provincia,
  distrito: client.distrito,
  estado: client.estado
});

// Alias for mapClientToDB
export const mapClienteToDB = mapClientToDB;

export const mapContactFromDB = (db: ContactoClienteDB): ClientContact => ({
  id: db.id.toString(),
  clientId: db.cliente_id.toString(),
  nombre: db.nombre,
  telefono: db.telefono,
  correo: db.correo,
  cargo: db.cargo,
  estado: db.estado
});

// Alias for mapContactFromDB
export const mapContactoClienteFromDB = mapContactFromDB;

export const mapContactToDB = (contact: Partial<ClientContact>): Partial<ContactoClienteDB> => ({
  cliente_id: contact.clientId ? parseInt(contact.clientId) : undefined,
  nombre: contact.nombre,
  telefono: contact.telefono,
  correo: contact.correo,
  cargo: contact.cargo,
  estado: contact.estado
});

// Alias for mapContactToDB
export const mapContactoClienteToDB = mapContactToDB;

// Helper function to convert between clientId and clienteId property naming
export const normalizeClientContact = (contact: Partial<ClientContact> | Partial<ClientContactSpanish>): Partial<ClientContact> => {
  const result = { ...contact } as any;
  
  // Handle Spanish style clienteId if present
  if ('clienteId' in contact && contact.clienteId) {
    result.clientId = contact.clienteId;
    delete result.clienteId;
  }
  
  return result;
};
