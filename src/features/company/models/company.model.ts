
/**
 * Company domain model
 * Core entity model for company domain
 */

// Core company domain entity
export interface Company {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// Value objects and specialized subtypes
export interface CompanyContact {
  id: string;
  companyId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface CompanyDocument {
  id: string;
  companyId: string;
  name: string;
  type: "contract" | "license" | "certificate" | "other";
  filePath: string;
  uploadedAt: string;
  expiryDate?: string;
}

// Domain events
export type CompanyCreatedEvent = { company: Company };
export type CompanyUpdatedEvent = { company: Company, changes: Partial<Company> };
export type CompanyDeletedEvent = { companyId: string };

// Repository interfaces
export interface CompanyRepository {
  findAll: () => Promise<Company[]>;
  findById: (id: string) => Promise<Company | null>;
  create: (company: Omit<Company, 'id'>) => Promise<Company>;
  update: (id: string, data: Partial<Company>) => Promise<Company>;
  delete: (id: string) => Promise<void>;
}

// Database schema mapping for Supabase
export interface CompanyDB {
  id: number;
  razon_social: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

// Domain mappers
export const mapCompanyFromDB = (db: CompanyDB): Company => ({
  id: db.id.toString(),
  name: db.razon_social,
  ruc: db.ruc,
  address: db.direccion,
  phone: db.telefono || '',
  email: db.correo || '',
  contact: '', // Not in DB schema, would need to be fetched separately
  status: db.estado ? 'active' : 'inactive',
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapCompanyToDB = (domain: Partial<Company>): Partial<CompanyDB> => ({
  ...(domain.id ? { id: parseInt(domain.id) } : {}),
  ...(domain.name ? { razon_social: domain.name } : {}),
  ...(domain.ruc ? { ruc: domain.ruc } : {}),
  ...(domain.address ? { direccion: domain.address } : {}),
  ...(domain.phone ? { telefono: domain.phone } : {}),
  ...(domain.email ? { correo: domain.email } : {}),
  ...(domain.status ? { estado: domain.status === 'active' } : {})
});
