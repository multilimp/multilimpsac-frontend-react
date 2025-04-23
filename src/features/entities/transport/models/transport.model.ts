
// Transport domain model
export interface Transport {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  cobertura?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // English mappings for consistency (used by some components)
  name?: string;
  address?: string;
  department?: string;
  province?: string;
  district?: string;
  coverage?: string;
  status?: boolean;
}

export interface TransportContact {
  id: string;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  email?: string; // For compatibility with some components
  estado: boolean;
  transporte_id?: string;
}

// Database schema mappings
export interface TransportDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  cobertura?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TransportContactDB {
  id: number;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  transporte_id?: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mapping functions
export const mapTransportFromDB = (db: TransportDB): Transport => ({
  id: db.id.toString(),
  razon_social: db.razon_social,
  ruc: db.ruc,
  direccion: db.direccion,
  departamento: db.departamento,
  provincia: db.provincia,
  distrito: db.distrito,
  cobertura: db.cobertura,
  estado: db.estado,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
  
  // English mappings
  name: db.razon_social,
  address: db.direccion,
  department: db.departamento,
  province: db.provincia,
  district: db.distrito,
  coverage: db.cobertura,
  status: db.estado
});

export const mapTransportToDB = (transport: Partial<Transport>): Partial<TransportDB> => ({
  ...(transport.id ? { id: parseInt(transport.id) } : {}),
  ...(transport.razon_social !== undefined ? { razon_social: transport.razon_social } : {}),
  ...(transport.name !== undefined && !transport.razon_social ? { razon_social: transport.name } : {}),
  ...(transport.ruc !== undefined ? { ruc: transport.ruc } : {}),
  ...(transport.direccion !== undefined ? { direccion: transport.direccion } : {}),
  ...(transport.address !== undefined && !transport.direccion ? { direccion: transport.address } : {}),
  ...(transport.departamento !== undefined ? { departamento: transport.departamento } : {}),
  ...(transport.department !== undefined && !transport.departamento ? { departamento: transport.department } : {}),
  ...(transport.provincia !== undefined ? { provincia: transport.provincia } : {}),
  ...(transport.province !== undefined && !transport.provincia ? { provincia: transport.province } : {}),
  ...(transport.distrito !== undefined ? { distrito: transport.distrito } : {}),
  ...(transport.district !== undefined && !transport.distrito ? { distrito: transport.district } : {}),
  ...(transport.cobertura !== undefined ? { cobertura: transport.cobertura } : {}),
  ...(transport.coverage !== undefined && !transport.cobertura ? { cobertura: transport.coverage } : {}),
  ...(transport.estado !== undefined ? { estado: transport.estado } : {}),
  ...(transport.status !== undefined && transport.estado === undefined ? { estado: transport.status } : {}),
});

// Transport contact mappers
export const mapTransportContactFromDB = (db: TransportContactDB): TransportContact => ({
  id: db.id.toString(),
  nombre: db.nombre,
  cargo: db.cargo,
  telefono: db.telefono,
  correo: db.correo,
  email: db.correo,
  estado: db.estado,
  transporte_id: db.transporte_id?.toString()
});

export const mapTransportContactToDB = (contact: Partial<TransportContact>): Partial<TransportContactDB> => ({
  ...(contact.id ? { id: parseInt(contact.id) } : {}),
  ...(contact.nombre !== undefined ? { nombre: contact.nombre } : {}),
  ...(contact.cargo !== undefined ? { cargo: contact.cargo } : {}),
  ...(contact.telefono !== undefined ? { telefono: contact.telefono } : {}),
  ...(contact.correo !== undefined ? { correo: contact.correo } : {}),
  ...(contact.email !== undefined && !contact.correo ? { correo: contact.email } : {}),
  ...(contact.transporte_id ? { transporte_id: parseInt(contact.transporte_id) } : {}),
  ...(contact.estado !== undefined ? { estado: contact.estado } : {})
});
